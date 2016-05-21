var imap = require("imap");
var emailjs = require("emailjs");
var events = require("events");
var spaceReduce = function(raw){
  while(raw.indexOf("   ")>-1) {
    raw = raw.replace("   "," ");
  }
  while(raw.indexOf("  ")>-1) {
    raw = raw.replace("  "," ");
  }
  return raw;
};
var rawToObject = function(raw){
  var lines = raw.split("\n");
  /*insert narcotic substance joke here*/
  var result = {};
  result.verbose = lines[0];
  result.fileName = lines[3].replace("* name..: ", "");
  result.size = Number(lines[4].replace("* size..: ",""));
  result.MD5 = lines[5].replace("* md5...: ","");
  result.SHA1 = lines[6].replace("* sha1..: ","");
  result.scans = [];
  for (var index = 9; index < lines.split; index++) {
    var item = {};
    item.scanner = lines[index].substring(0, lines[index].indexOf(" "));
    var afterScanner = spaceReduce(lines[index].substring(lines[index].indexOf(" "), lines[index].length));
    while(afterScanner[0]==" ") {
      afterScanner = afterScanner.substring(1,afterScanner.length);
    }
    item.versionTimestamp = afterScanner.substring(0, afterScanner.indexOf(" "));
    var afterTimestamp = afterScanner.substring(afterScanner.indexOf(" "), afterScanner.length);
    while (afterTimestamp[0]==" ") {
      afterTimestamp = afterTimestamp.substring(1, afterTimestamp.length);
    }
    item.verbose = afterTimestamp;
    result.scans[index-9] = item;
  }
  return result;
};
var emailFeatures = function(config){
  var self = this, imapConnection = {};
  var imapOpen = false;
  var internalEmitter = new events.EventEmitter();
  this.on = function(condition, callback){
    internalEmitter.on(condition, callback);
    return self;
  };
  this.connect = function(){
    imapConnection = new imap(config.IMAP);
    imapConnection.once("error", function(e){
      internalEmitter.emit("error", e);
    });
    imapConnection.once("ready", function(){
      imapConnection.openBox('INBOX', true, function(err, box){
        if (err) {
          internalEmitter.emit("error", err);
          return;
        }
        imapOpen = true;
        var getResponses = function(){
          var messageQuery = imapConnection.seq.search(['UNSEEN', ['FROM', 'scan@virustotal.com']], function(err1, results){
            if (err1) {
              internalEmitter.emit(err1);
              return;
            }
            var messages = imapConnection.fetch(results, {bodies : ['TEXT'], markSeen: true});
            messages.on("message", function(msg, seqno){
              var bodyText = "";
              msg.on('attributes', function(attrs) {});
              msg.on("body",function(stream, info){
                stream.on("error", function(e2){
                  internalEmitter.emit("error", e2);
                });
                stream.on("data", function(segment) {
                  bodyText = bodyText + segment;
                });
                stream.on("end", function(){
                  internalEmitter.emit("analysis", rawToObject(bodyText));
                });
              });
            });
            messages.once("error", function(e){
              internalEmitter.emit("error", e);
            });
            messages.once("end", function(){
              if (imapOpen==true) {
                setTimeout(getResponses, 360000);
              }
            });
          });
        };
        getResponses();
        internalEmitter.emit("open");
      });
    });
    return self;
  };
  this.endConnection = function(){
    imapOpen = false;
    imapConnection.once("end", function(){
      internalEmitter.emit("end");
    });
    imapConnection.end();
    return self;
  };
  this.submitFileForAnalysis = function(fileContent, fileName, type){
    var smtpConnection = emailjs.server.connect(config.SMTP);
    smtpConnection.send({
      text: " ",
      from: config.sender + " <" + config.sender + ">",
      to: "scan <scan@virustotal.com>",
      subject: "SCAN",
      attachment: {
          data: "" + fileContent,
          type: type,
          name: fileName
        }
    }, function(err, message){
      if (err) {
        internalEmitter.emit("error", err);
        return;
      }
      internalEmitter.emit("sent", message);
      return;
    });
    return self;
  };
  return this;
};
var makeEmailConnection = function(config) {
  return new emailFeatures(config);
};
var features = {};
features.makeEmailConnection = makeEmailConnection;
module.exports = exports = features;
