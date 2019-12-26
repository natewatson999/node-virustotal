"use strict";
const v3 = require('./v3.js');
const vt = v3.makeAPI();
const hashed = v3.sha256('http://wikionemore.com/');
vt/*.queueTest(1).ipLookup('8.8.8.8', function(err, res){
	console.log(err);
	console.log(JSON.stringify(res));
}).ipCommentLookup('8.8.8.8', function(err, res){
	console.log(err);
	console.log(JSON.stringify(res));
}).postIPcomment('8.8.8.8',"This address is safe. I'm just testing an API", function(err, res){
	console.log(err);
	console.log(JSON.stringify(res));
})*/.urlLookup(/*'6a106dcb91cc315397c96c39758ff724e53ea0329daf2eaeccbb65820b73c97e'*/hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});