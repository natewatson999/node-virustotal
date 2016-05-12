var events = require("events");
var frameTypeNormalize = function(input) {
  switch (input) {
    case null:
    case "null":
    case "0":
    case 0:
    case "DC":
    case "dc":
      return "0";
    case 1:
    case "1":
    case "1hz":
    case "1HZ":
      return "1";
    case "5":
    case 5:
    case "commonLowFormat"
      return "5"
    case "60":
    case 60:
    case "NTSCtotal":
    case "60hz":
    case "60HZ":
      return "60";
    case "50":
    case 50:
    case "PALtotal":
    case "SECAMtotal":
    case "50hz":
    case "50HZ":
      return "50";
    case 25:
    case "25":
    case "PALhalf":
    case "SECAMhalf":
    case "25hz":
    case "25HZ":
      return "25";
    case 30:
    case "30":
    case "NTSChalf":
    case "30hz":
    case "30HZ":
      return "30";
    case 40:
    case "40":
    case "40hz":
    case "40HZ":
      return "40";
    case 400:
    case "400":
    case "400hz":
    case "400HZ":
    case "MIL-STD-704":
      return "400";
    case 100:
    case "100":
    case "100hz":
    case "100HZ":
      return "100";
    case 600:
    case "600":
    case "600hz":
    case "600HZ":
      return "600";
    case 120:
    case "120":
    case "120hz":
    case "120HZ":
      return "120";
    case 200:
    case "200":
    case "200hz":
    case "200HZ":
      return "200";
    case 240:
    case "240":
    case "240hz":
    case "240HZ":
      return "240";
    case 1200:
    case "1200":
    case "1200hz":
    case "1200HZ":
    case "commonHighFormat"
      return "1200";
    default:
      return "0";
  }
};
var FrameMultiplexer = function(rawInmode, rawOutmode, instream){
  var inmode = frameTypeNormalize(rawInmode);
  var outmode = frameTypeNormalize(rawOutmode);
  if ((inmode)==(outmode)) {
    return instream;
  }
  var result = {};
  var FrameEmitter = new events.EventEmitter();
  result.on = function(condition, callback){
    switch(condition){
      case "error":
        instream.on("error", callback);
        return;
      case "end":
        instream.on("end", callback);
        return;
      case "data":
        FrameEmitter.on("data", callback);
        return;
      default:
        return;
    }
  };
  if ((inmode=="0")||(outmode=="0")){
    return result;
  }
  if (inmode=="5") {

  }
  outerSwitch:
  switch(inmode){
    case "0"
      break outerSwitch;
    case "60":
      switch60:
      switch(outmode){
        case "120":
          instream.on("data", function(input){
            FrameEmitter.emit("data", input);
            FrameEmitter.emit("data", input);
          })
          break switch60;
      }
      break outerSwitch;
  }
  return result;
};
var features = {};
module.exports = exports = features;
