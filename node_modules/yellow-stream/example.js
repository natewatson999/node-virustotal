var https = require("https");
var yellow = require("./code.js");
https.get("https://www.google.com", function(raw){
	var stream = new yellow.consolidator(raw);
	stream.on("error", function(e){
		console.log(e);
	});
	stream.on("end", function(value){
		console.log(value);
	});
});
https.get("https://www.google.com", function(raw){
	var stream = new yellow.toFrameStream(raw);
	stream.frameSize = 32;
	stream.on("error", function(e){
		console.log(e);
	});
	stream.on("data", function(value){
		console.log(value);
	});
	stream.on("end", function(value){
		console.log(value);
	});
});
var http = require("http");
http.get("http://www.uglydress.com/", function(raw){
	var stream = new yellow.splitStream(raw, "\n");
	stream.on("error", function(e){
		console.log(e);
	});
	stream.on("data", function(value){
		console.log(value);
		console.log("\n");
	});
	stream.on("end", function(value){
		console.log(value);
	});
});
http.get("http://www.uglydress.com/", function(raw){
	var stream = new yellow.breakByLine(raw);
	stream.on("error", function(e){
		console.log(e);
	});
	stream.on("data", function(value){
		console.log(value);
		console.log("\n");
	});
	stream.on("end", function(value){
		console.log(value);
	});
});
