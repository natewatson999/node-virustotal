var emailjs = require("emailjs");
var events = require("events");
var mailNotifier = require("mail-notifier");

var spaceReduce = function(raw){
  while(raw.indexOf("\t")>-1) {
    raw = raw.replace("\t"," ");
  }
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
  var internalEmitter = new events.EventEmitter();
  this.on = function(condition, callback){
    internalEmitter.on(condition, callback);
    return self;
  };
  this.startCheckingForResponses = function(){
    var inboxConfig = {
      username: config.IMAP.username,
      password: config.IMAP.password,
      host: config.IMAP.host,
      port: config.IMAP.port,
      tls: config.IMAP.tls,
      mailbox: config.IMAP.mailbox,
      searchFilter: ["UNSEEN"],
      markSeen: true,
      fetchUnreadOnStart: true,
    };
    imapConnection = mailNotifier(inboxConfig);
    imapConnection.on("mail", function(message){
      if (message.from=="scan@virustotal.com") {
        internalEmitter.emit("analysis", rawToObject(message.text));
        return;
      }
      if ((message.from.address != null)&&( message.from.address == "scan@virustotal.com")) {
        internalEmitter.emit("analysis", rawToObject(message.text));
        return;
      }
      for (var index = 0; index < message.from.length, index++) {
        if (message.from[index] == "scan@virustotal.com") {
          internalEmitter.emit("analysis", rawToObject(message.text));
          return;
        }
        if (message.from[index].address=="scan@virustotal.com") {
          internalEmitter.emit("analysis", rawToObject(message.text));
          return;
        }
      }
      return;
    });
    imapConnection.on("error", function(e){
      internalEmitter.emit("error", e);
    })
    imapConnection.start();
  };
  this.stopCheckingForResponses = function(){
    if (imapConnection != null) {
      imapConnection.close();
    }
    return self;
  };

  this.submitFileForAnalysis = function(fileContent, fileName, type){
    var smtpConnection = emailjs.server.connect(config.SMTP);
    smtpConnection.send({
      text: " ",
      from: config.sender,
      to: "scan@virustotal.com",
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
