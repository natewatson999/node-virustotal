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
		)};
		return;
	};
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
