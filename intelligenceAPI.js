var request = require("request");
var intelAPI = function(){
  var apiKey = "e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d";
  this.setKey = function(replacement){
    apiKey = replacement;
    return this;
  };
  this.getKey = function(){
    return apiKey;
  };
  var exportRuleset = function(ruleset, responseProc, errProc){
    if (ruleset==null) {
      exportRuleset("*", responseProc, errProc);
      return;
    }
    if (ruleset=="") {
      exportRuleset("*", responseProc, errProc);
      return;
    }
    var queryURL = "https://www.virustotal.com/intelligence/hunting/export-ruleset/?output=json&ruleset=" + ruleset + "&key=" + apiKey;
    request(queryURL, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(response.statusCode);
        return;
      }
      try {
        if (body==""){
          responseProc([]);
          return;
        }
        data = JSON.parse(body);
        responseProc(data);
        return;
      } catch (e) {
        errProc(e);
        return;
      }
    });
    return;
  };
  var deleteNotifications = function(notifications, resultProc, errProc, intermediates){
    if (notifications.length == 0) {
      if (intermediates != null) {
        resultProc(intermediates);
        return;
      }
      resultProc({
        deleted: 0,
        received: 0,
        result: 1
      });
      return;
    }
    var queryURL = "https://www.virustotal.com/intelligence/hunting/delete-notifications/programmatic/?key=" + apiKey;
    if (notifications.length < 101) {
      request({
        uri: queryURL,
        body: JSON.stringify(notifications),
        method: "POST",
        headers: [{
          name: "content-type",
          value: "application/json"
        }]
      }, function(error, response, body){
        if (error) {
          errProc(error);
          return;
        }
        if (response.statusCode > 399) {
          errProc(response.statusCode);
          return;
        }
        try {
          var data = JSON.parse(body);
          switch(data.result){
            case 1:
            case 0:
              if (intermediates != null) {
                intermediates[intermediates.length] = data;
                resultProc(intermediates);
                return;
              }
              resultProc(data);
              return;
            case -1:
            case -2:
            default:
              errProc(data);
              return;
          }
        } catch (e) {
          errProc(e);
          return;
        }
      });
      return;
    }
    var segment = notifications.slice(0, 100);
    var remainder = notifications.slice(100);
    request({
      uri: queryURL,
      body: JSON.stringify(segment),
      method: "POST",
      headers: [{
        name: "content-type",
        value: "application/json"
      }]
    }, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(response.statusCode);
        return;
      }
      try {
        var data = JSON.parse(body);
        switch(data.result){
          case 1:
          case 0:
            if (intermediates == null) {
              intermediates = [];
            }
            intermediates[intermediates.length] = data;
            deleteNotifications(notifications, resultProc, errProc, intermediates);
            return;
          case -1:
          case -2:
          default:
            errProc(data);
            return;
        }
      } catch (e) {
        errProc(e);
        return;
      }
    });
    return;
  };
  this.getFile = function(hashValue, resultProc, errProc) {
    var deadlyURL = "https://www.virustotal.com/intelligence/download/?hash=" + hashValue + "&apikey=" + apiKey ;
    request(deadlyURL, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(response.statusCode);
        return;
      }
      resultProc(body);
      return;
    });
  };
  this.search = function(query, page, responseProc, errProc){
    var queryURL = "https://www.virustotal.com/intelligence/search/programmatic/?apikey=" + apiKey;
    if (page != null) {
      if (page != "") {
        queryURL = queryURL + ("&page=" + page);
      }
    }
    queryURL = queryURL + ("&query=" + query);
    request(queryURL, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode) {
        errProc(response.statusCode);
        return;
      }
      try {
        var data = JSON.parse(body);
        switch (data.response_code) {
          case 1:
          case 0:
            responseProc(data);
            return;
          case -1:
          case -2;
          default:
            errProc(data);
            return;
        }
        return;
      } catch (e) {
        errProc(e);
        return;
      }
    });
  };
  this.deleteNotifications = deleteNotifications;
  this.exportRuleset = exportRuleset;
  return;
};
module.exports = exports = {
  makeIapiConnection : function(){
    return new intelAPI();
  }
};
