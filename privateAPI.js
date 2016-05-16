var request = require("request");
var features = {};
var privateAPI = function(){
  var key = "";
  this.setKey = function(replacement){
    key = replacement;
    return this;
  };
  this.getKey = function(){
    return key;
  }
  var getComments = function(resource, responseProc, errProc) {
    var queryURL = "https://www.virustotal.com/vtapi/v2/comments/get?resource=" + resource + "&apikey=" + key;
    request(queryURL, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
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
  };
	var publishUrlComment = function(resource, comment, resultProc, errProc){
		if (errProc==null) {
			errProc = function(e) {
				publishUrlComment(resource, comment, resultProc, null);
				return;
			}
		}
		var workingURL = "https://www.virustotal.com/vtapi/v2/comments/put?resource=" + encodeURIComponent(resource) + "&comment=" + encodeURIComponent(comment) + "&apikey=" + key ;
		request({url:workingURL, method:"POST"}, function(error, response, body){
			if (error) {
				errProc(error);
				return;
			}
      if (response.statusCode > 399) {
        errProc(body);
        return;
      }
			try {
				var result = JSON.parse(body);
				switch (result.response_code) {
			    case 1:
						resultProc(result);
						return;
					case 0:
					default:
						errProc(result);
						return;
				}
			} catch (e) {
				errProc(e);
				return;
			}
		});
		return;
	};
  var getReport = function(queryURL, responseProc, errProc) {
    request(queryURL, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
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

  var upperLimit = 32*1024*1024;
  var sendFileToURL = function(filename, filetype, content, URL, callback){
    var sendOptions = {
      url: URL,
      formData: {file: { value: filecontent, options: { filename: filename, filetype: filetype}}}
		};
    request.post(sendOptions, callback);
  };
  var sendFilePreLogic = function(filename, filetype, content, resultProc, errProc){
    var callbackProc = function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
        return;
      }
      try {
        var data = JSON.parse(body);
        switch (data.response_code) {
          case 1:
            resultProc(data);
            return;
          case 0:
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
    };
    if (content.length < upperLimit ) {
      sendFileToURL(filename, filetype, content, "https://www.virustotal.com/vtapi/v2/file/scan?apikey=" + key, callbackProc);
      return;
    }
    request.get("https://www.virustotal.com/vtapi/v2/file/scan/upload_url?apikey=" + key, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
        return;
      }
      try {
        var data = JSON.parse(body);
        sendFileToURL(filename, filetype, content, data.upload_url, callbackProc);
        return;
      } catch (e) {
        errProc(e);
        return;
      }
    });
    return;
  };
  var submitUrlForScanning = function(URL, resultProc, errProc){
    var fullURL = "https://www.virustotal.com/vtapi/v2/url/scan?url=" + encodeURIComponent(URL) + "&apikey=" + key;
    request({url: URL, method:"POST"}, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
        return;
      }
      try{
        var data = JSON.parse(body);
        switch(data.response_code) {
          case 1:
            resultProc(data);
            return;
          case 0:
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
  };

  this.submitFileForAnalysis = sendFilePreLogic;
  this.getDomainReport = function(domain, responseProc, errProc){
    getReport("https://www.virustotal.com/vtapi/v2/domain/report?domain=" + domain + "&apikey=" + key, responseProc, errProc);
    return;
  };
  this.getIP4Report = function(ip, responseProc, errProc){
    getReport("https://www.virustotal.com/vtapi/v2/ip-address/report?ip=" + ip + "&apikey=" + key, responseProc, errProc);
    return;
  };
  this.submitUrlForScanning = submitUrlForScanning;
	this.publishFileComment = publishUrlComment;
	this.publishUrlComment = publishUrlComment;
  this.getFileComments = getComments;
  this.getUrlComments = getComments;
  return;
};
features.makePrivateAPI = function(){
  return new privateAPI();
};
module.exports = exports = features;
