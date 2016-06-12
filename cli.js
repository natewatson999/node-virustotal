var fs = require("fs");
var shelljs = require("shelljs");
var readline = require("readline");
var publicAPI = require("./code.js");
var rl = readline.createInterface(process.stdin, /*process.stdout*/ null);
var sendPrompt = function(){
  rl.resume();
  process.stdout.write(">");
  return;
};
var mode = "public";
var defaultKeystore = {
  public: ["e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d"],
  honey: [],
  intel: [],
  private: []
};
var mode = "public";
var workingKeystore = defaultKeystore;
var workingConnection = publicAPI.MakePublicConnection();
workingConnection.setKey(workingKeystore.public[0]);
rl.on("line", function(input){
  rl.pause();
  var segments = input.split(" ");
  var initial = segments[0];
  switch(initial) {
    case "pwd":
      console.log(process.cwd());
      sendPrompt();
      return;
    case "exit":
      process.exit(0);
      return;
    case "cd":
      if ((segments.length > 1)&&(segments[1] != "~")) {
        process.chdir(segments[1]);
      }
      sendPrompt();
      return;
    case "printKeyring":
      console.dir(workingKeystore);
      sendPrompt();
      return;
    case "saveKeyring":
      if (segments.length > 2) {
        shelljs.touch(segments[1]);
        fs.writeFileSync("./" + segments[1], JSON.stringify(workingKeystore));
      }
      sendPrompt();
      return;
    case "loadKeyring":
      if (segments.length > 1) {
        try {
          var raw = fs.readFileSync(segments[1]);
          var parsed = JSON.parse(raw);
          workingKeystore = parsed;
        } catch (e) {
          console.log(e);
        }
      }
      sendPrompt();
      return;
    case "printMode":
      console.log(mode);
      sendPrompt();
      return;
    case "addKey":
      if (segments.length > 2){
        addKeySwitch:
        switch(segments[1]) {
          case "public":
            workingKeystore.public[workingKeystore.public.length] = segments[2];
            break addKeySwitch;
          case "private":
            workingKeystore.private[workingKeystore.private.length] = segments[2];
            break addKeySwitch;
          case "intel":
            workingKeystore.intel[workingKeystore.intel.length] = segments[2];
            break addKeySwitch;
          case "honey":
            workingKeystore.honey[workingKeystore.honey.length] = segments[2];
            break addKeySwitch;
          default:
            break addKeySwitch;
        }
      }
      sendPrompt();
      return;
    case "deleteKey":
      if (segments.length > 2){
        deleteKeySwitch:
        switch(segments[1]) {
          case "public":
            workingKeystore.public = workingKeystore.public.splice(segments[2], 1);
            break deleteKeySwitch;
          case "private":
            workingKeystore.private = workingKeystore.private.splice(segments[2], 1);
            break deleteKeySwitch;
          case "intel":
            workingKeystore.intel = workingKeystore.intel.splice(segments[2], 1);
            break deleteKeySwitch;
          case "honey":
          workingKeystore.honey = workingKeystore.honey.splice(segments[2], 1);
            break deleteKeySwitch;
          default:
            break deleteKeySwitch;
        }
      }
      sendPrompt();
      return;
    case "setKey":
      if (segments.length > 2) {
        setKeySwitch:
        switch(segments[1]) {
          case "public":
            workingKeystore.public = workingKeystore.public.splice(segments[2], 1);
            break setKeySwitch;
          case "private":
            workingKeystore.private = workingKeystore.private.splice(segments[2], 1);
            break setKeySwitch;
          case "intel":
            workingKeystore.intel = workingKeystore.intel.splice(segments[2], 1);
            break setKeySwitch;
          case "honey":
          workingKeystore.honey = workingKeystore.honey.splice(segments[2], 1);
            break setKeySwitch;
          default:
            break setKeySwitch;
        }
      }
      sendPrompt();
      return;
    case "help":
    case "getDelay":
    case "setDelay":
    case "IPv4Report":
    case "DomainReport":
    case "submitURL":
    case "getUrlReport":
    case "publishUrlComment":
    case "publishFileComment":
    case "sendFile":
    case "rescanFile":
    case "getFileReport":
    case "getUrlComments":
    case "getFileComments":
    case "getFile":
    case "fileRescan":
    case "getFileBehavior":
    case "getFileNetworkActivity":
    case "getClusters":
    case "getFileFeed":
    case "getUrlFeed":
    case "getNextFalsePositive":
    case "search":
    case "exportRuleset":
    case "deleteNotifications":
    default:
      console.log("feature not yet implemented");
      sendPrompt();
      return;
  }
});
sendPrompt();
