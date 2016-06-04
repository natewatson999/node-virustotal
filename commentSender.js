var request = require("request");
var sender = function(resource, comment, APIkey, responseProc, errProc){
  var submissionURL = ("https://www.virustotal.com/vtapi/v2/comments/put?resource=" + encodeURIComponent(resource)) + (("&comment=" + encodeURIComponent(comment)) + ("&apikey=" + APIkey));
  this.attempt = function(){
    request({url:submissionURL, method:"POST", gzip: true, headers: {"User-Agent": "gzip"}}, function(error, response, body){
      if (error) {
        errProc(error);
        return;
      }
      if(response.statusCode > 399) {
        errProc(response.statusCode + "");
        return;
      }
      try {
        var result = JSON.parse(body);
        switch (result.response_code) {
          case 1:
            responseProc(result);
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
  return;
};
module.exports = exports = sender;
