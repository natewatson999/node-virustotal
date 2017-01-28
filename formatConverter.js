module.exports = exports = function(src) {
  return function(){
    var cb = arguments[arguments.length-1];
    var dataProc = function(data){
      cb(null, data);
    };
    var errProc = function(err) {
      cb(err, null);
    };
    var evalString = "src(";
    for (var index = 0; index < arguments.length - 1; index++) {
      evalString = evalString + ("arguments[" + index + "], ") ;
    }
    evalString = evalString + "dataProc, errProc);";
    return eval(evalString);
  };
};
