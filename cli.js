var fs = require("fs");
var shelljs = require("shelljs");
var readline = require("readline");
var publicAPI = require("./code.js");
var rl = readline.createInterface(process.stdin, process.stdout);
var sendPrompt = function(){
  rl.resume();
  rl.setPrompt(">");
  rl.prompt();
};
var defaultKeystore = {
  public: ["e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d"],
  honey: [],
  intel: [],
  private: []
};
var workingKeystore = defaultKeystore;

rl.on("line", function(input){
  rl.pause();
  var segments = input.split(" ");
  var initial = segments[0];
  switch(initial) {
    case "printKeyring":
    case "saveKeyring":
    case "loadKeyring":
    
  }
});
