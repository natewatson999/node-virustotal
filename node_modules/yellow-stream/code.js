var events = require("events");
var breakByLine = function(basis, posix, macOS, windows, reverseWindows){
	if (posix==null) {
		posix = true;
	}
	if (macOS==null) {
		macOS = true;
	}
	if (windows==null) {
		windows = true;
	}
	if (reverseWindows==null) {
		reverseWindows = true;
	}
	this.buffer = "";
	this.emitter = new events.EventEmitter();
	var phraseIns = "";
	if (posix==true) {
		phraseIns = phraseIns + "|\n";
	}
	if (macOS==true) {
		phraseIns = phraseIns + "|\r";
	}
	if (windows==true) {
		phraseIns = phraseIns + "|\r\n";
	}
	if (windows==true) {
		phraseIns = phraseIns + "|\n\r";
	}
	if(phraseIns.length > 0) {
		phraseIns = phraseIns.substring(1, phraseIns.length);
	}
	var reg = new RegExp(phraseIns);
	var self = this;
	this.on = function(condition, callback) {
		if ((!condition)||(!callback)) {
			self.emitter.emit("error", {});
			return;
		}
		self.emitter.on(condition, callback);
	};
	basis.on("data", function(data){
		self.buffer = self.buffer + data;
		var segments = self.buffer.split(reg);
		self.buffer = segments[segments.length-1];
		for (var index=0; index < segments.length-1; index++) {
			self.emitter.emit("data", segments[index]);
		}
	});
	basis.on("error", function(error){
		self.emitter.emit("error", error);
	});
	basis.on("end", function(){
		self.emitter.emit("end", self.buffer);
	});
	return;
};
var splitStream =  function(basis, splitPhrase){
	this.buffer = "";
	this.emitter = new events.EventEmitter();
	this.splitPhrase = splitPhrase;
	var self = this;
	this.on = function(condition, callback) {
		switch(condition) {
			case "data":
				self.emitter.on("data", callback);
				break;
			case "error":
				self.emitter.on("error", callback);
				break;
			case "end":
				self.emitter.on("end", callback);
				break;
			default:
				break;
		}
	};
	basis.on("data", function(data){
		self.buffer = self.buffer + data;
		while (self.buffer.indexOf(self.splitPhrase) > -1) {
			self.emitter.emit("data", self.buffer.substring(0, (self.buffer.indexOf(self.splitPhrase))));
			self.buffer = self.buffer.substring((self.buffer.indexOf(self.splitPhrase) + self.splitPhrase.length), self.buffer.length);
		}
	});
	basis.on("error", function(error){
		self.emitter.emit("error", error);
	});
	basis.on("end", function(){
		self.emitter.emit("end", self.buffer);
	});
	return;
};
var consolidator = function(basis){
	var buffer = "";
	basis.on("data", function(data){
		buffer = buffer + data;
	});
	this.on = function(condition, callback){
		switch(condition) {
			case "end":
				basis.on("end", function(){
					callback(buffer);
				});
				break;
			case "error":
				basis.on("error", function(error){
					callback(error);
				});
				break;
			default:
				break;
		}
	};
	return;
};
var ToFrameStream = function(basis){
	this.buffer = "";
	this.frameSize = 64;
	this.emitter = new events.EventEmitter();
	var self = this;
	this.on = function(condition, callback) {
		switch(condition) {
			case "data":
				self.emitter.on("data", callback);
				break;
			case "error":
				self.emitter.on("error", callback);
				break;
			case "end":
				self.emitter.on("end", callback);
				break;
			default:
				break;
		}
	};
	basis.on("data", function(data){
		self.buffer = self.buffer + data;
		while (self.buffer.length >= self.frameSize) {
			self.emitter.emit("data", self.buffer.substring(0, (self.frameSize-1)));
			self.buffer = self.buffer.substring((self.frameSize-1), self.buffer.length);
		}
	});
	basis.on("error", function(error){
		self.emitter.emit("error", error);
	});
	basis.on("end", function(){
		self.emitter.emit("end", self.buffer);
	});
	return;
};
var features = {};
features.breakByLine = breakByLine;
features.splitStream = splitStream;
features.toFrameStream = ToFrameStream;
features.consolidator = consolidator;
module.exports = exports = features;
