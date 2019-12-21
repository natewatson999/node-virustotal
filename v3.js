"use strict";
const output = {};
output.legacyEdition = function(){
	return require('code.js');
};
output.malicious = "malicious";
output.harmless = "harmless";
const getString = "GET";
const postString = "POST";
const request = require('request');
const millisecondsPerMinute = 60000;
const defaultDelay = millisecondsPerMinute/4;
const defaultKey = "e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d";
const v3 = function(delay){
	if (delay==null) {
		delay=defaultDelay;
	}
	this.time = delay; 
	this.key = defaultKey;
	const self = this;
	this.getKey = function(){
		return self.key;
	};
	this.setKey = function(k){
		self.key = k;
		return self;
	};
	this.getDelay = function(){
		return time;
	};
	this.setDelay = function(t){
		self.time = t;
		return self;
	};
	
	let taskHead = null;
	let lastTask = null;
	const addTask = function(task){
		if (taskHead==null){
			taskHead = {val: task, next: null};
			lastTask = taskHead;
			return;
		}
		lastTask.next = {val: task, next: null};
		lastTask = lastTask.next;
	};
	const popTask = function(){
		if (taskHead==null) {
			return null;
		}
		const task = taskHead.val;
		taskHead = taskHead.next;
		if (taskHead==null){
			lastTask = null;
		}
		return task;
	};
	const performNext = function(){
		const timeout = setTimeout(function(){
			const f = popTask();
			if (f==null){
				return;
			}
			performNext();
			f();
		}, self.time);
	};
	const putInLine = function(input){
		const wasNull = (taskHead==null);
		addTask(input);
		if (wasNull){
			performNext();
		}
	};
	
	this.queueTest = function(input){
		const f = function(){
			console.log(input);
		};
		putInLine(f);
		return self;
	};

	const makeGetFunction = function(beforePath, afterPath){
		return function(contentID, cb){
			const id = contentID;
			const callback = cb;
			putInLine(function(){
				request({
					url: beforePath + id + afterPath,
					method: getString,
					headers: {'x-apikey': self.getKey()}
				}, function(err, res, body){
					if (err) {
						callback(err);
						return;
					}
					if (res.statusCode > 399) {
						callback(body);
					}
					callback(null, body);
				});
			});
			return self;
		};
	};
	const makePostFunction = function(beforePath, afterPath){
		return function(contentID, contents, cb){
			const body = contents;
			const id = contentID;
			const callback = cb;
			putInLine(function(){
				request({
					url: beforePath + id + afterPath,
					method: postString,
					headers: {'x-apikey': self.getKey()},
					body: JSON.stringify(body)
				}, function(err, res, body){
					if (err) {
						callback(err);
						return;
					}
					if (res.statusCode > 399) {
						callback(body);
					}
					callback(null, body);
				});
			});
			return self;
		};
	};
	const makePostTransform = function(initialFunction, bodyModification){
		return function(id, content, callback){
			const modded = bodyModification(content);
			return initialFunction(id, modded, callback);
		};
	};
	const commentToObject = function(input){
		return {
			"data": {
				"type": "comment",
				"attributes": {
					"text": input
				}
			}
		};
	};
	const makeVoteObject = function(input){
		return {
			"data": {
				"type": "vote", 
				"attributes": {
					"verdict": input
				}
			}
		};
	};

	this.ipLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","");
	this.ipCommentLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","/comments");
	this.ipVotesLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","/votes");
	this.postIPcomment = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/ip_addresses/","/comments"), commentToObject);
	this.sendIPvote = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/ip_addresses/","/votes"), makeVoteObject);
};
output.makeAPI = function(delay){
	return new v3(delay);
};
module.exports = exports = output;