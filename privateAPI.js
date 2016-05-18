var request = require("request");
var features = {};
var leftPad = function(raw, length, padPhrase) {
  var workingString = raw;
  while (workingString.length < length) {
    workingString = padPhrase + workingString;
  }
  return workingString;
};
var rescan = function(resource, key){
  var dateString = null;
  var period = null;
  var repeatCount = null;
  var changesOnly = 0;
  var notifyURL = null;
  this.setDate = function(year, month, day, hour, minute, second){
    year = leftPad("" + year, 4, "0");
    month = leftPad("" + month, 2, "0");
    day = leftPad("" + day, 2, "0");
    hour = leftPad("" + hour, 2, "0");
    minute = leftPad("" + minute, 2, "0");
    second = leftPad("" + second, 2, "0");
    dateString = year + month + day + hour + minute + second;
    return this;
  };
  this.setPeriod = function(input){
    period = input;
    return this;
  };
  this.setRepeatCount = function(input) {
    repeatCount = input;
    return this;
  };
  this.setNotifyURL = function(replacement){
    notifyURL = replacement;
    return this;
  };
  this.setNotifyChangesOnly = function(input) {
    switch(input) {
      case null:
        changesOnly = 0;
        return this;
      case 1:
      case true:
        changesOnly = 1;
        return this;
      case 0:
      case false:
      default:
        changesOnly = 0;
        return this;
    }
    return this;
  };
  this.sendRequest = function(responseProc, errProc){
    var formattedRequest = "https://www.virustotal.com/vtapi/v2/file/rescan?apikey=" + key + "&resource=" + resource;
    if (dateString != null) {
      formattedRequest = formattedRequest + "&date=" + dateString;
    }
    if (period != null) {
      formattedRequest = formattedRequest + "&period=" + period;
    }
    if (repeatCount != null) {
      formattedRequest = formattedRequest + "&repeat=" + repeatCount;
    }
    if (notifyURL != null) {
      formattedRequest = formattedRequest + "&notify_url=" + notifyURL + "&notify_changes_only" + changesOnly;
    }
    request(formattedRequest, function(error, response, body){
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
            responseProc(data);
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
    return this;
  };
  this.cancel = function(responseProc, errProc) {
    request("https://www.virustotal.com/vtapi/v2/file/rescan/delete?apikey=" + key + "&resource=" + resource, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if (response.statusCode > 399) {
        errProc(body);
        return;
      }
      try {
        data = JSON.parse(body);
        switch (data.response_code) {
          case 1:
            responseProc(data);
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
    return this;
  };
  return;
};
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
  var retrieveUrlAnalysis = function(URL, responseProc, errProc, rescan, extendedData, continueProc) {
    var query = "https://www.virustotal.com/vtapi/v2/url/report?apikey=" + key + "&url=" + encodeURIComponent(URL);
    if (rescan==true) {
      query = query + "&rescan=1";
    }
    if (extendedData==true) {
      query = query + "&allinfo=1";
    }
    request.get(query, function(error, response, body){
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
          case -2:
            if (continueProc==null) {
              var next = function(){
                retrieveUrlAnalysis(URL, responseProc, errProc, false, extendedData, null);
              };
              setTimeout(next, 300000);
              return;
            }
            continueProc(data);
            return;
          case 1:
          case 0:
            responseProc(data);
            return;
          case -1:
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
  var getFileReport = function(scanID, responseProc, errProc, extendedData, continueProc){
    var fileResourceURL = "https://www.virustotal.com/vtapi/v2/file/report?apikey=" + key + "&resource=" + scanID;
    if (extendedData==true) {
      fileResourceURL = fileResourceURL + "&allinfo=1";
    }
    request(fileResourceURL, function(error, response, body){
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
          case -2:
            if (continueProc==null) {
              var next = function(){
                getFileReport(scanID, responseProc, errProc, extendedData, null);
              };
              setTimeout(next, 300000);
              return;
            }
            continueProc(data);
            return;
          case 1:
          case 0:
            responseProc(data);
            return;
          case -1:
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
  var getFile = function(hashCode, responseProc, errProc){
    var requestURL = "https://www.virustotal.com/vtapi/v2/file/download?apikey=" + key + "&hash=" + hashCode;
    var getFileProc = function(){
      request(requestURL, function(error, response, body){
        if (error) {
          errProc(error);
          return;
        }
        if (response.statusCode == 404) {
          errProc(response);
          return;
        }
        if (response.statusCode > 399) {
          getFileProc();
          return;
        }
        responseProc(body);
        return;
      });
    };
    return;
  };
  var makeRescan = function(resource) {
    return new rescan(resource, key);
  };
  this.makeRescan = makeRescan;
  this.getFile = getFile;
  this.getFileReport = getFileReport;
  this.retrieveUrlAnalysis = retrieveUrlAnalysis;
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
