"use strict";
const v3 = require('./v3.js');
const vt = v3.makeAPI();
vt.queueTest(1).ipLookup('8.8.8.8', function(err, res){
	console.log(err);
	console.log(JSON.stringify(res));
}).ipCommentLookup('8.8.8.8', function(err, res){
	console.log(err);
	console.log(JSON.stringify(res));
});