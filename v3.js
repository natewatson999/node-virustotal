"use strict";
const output = {};
output.legacyEdition = function(){
	return require('code.js');
};
output.sha256 = (function(){
	const sha256String = 'sha256';
	const crypto = require('crypto');
	const hexString = 'hex';
	return function(input){
		const hash = crypto.createHash(sha256String);
		hash.update(input);
		return (hash.digest(hexString));
	};
})();
output.malicious = "malicious";
output.harmless = "harmless";
const makeZipFileLink = 'https://www.virustotal.com/api/v3/intelligence/zip_files';
const getString = "GET";
const postString = "POST";
const request = require('request');
const millisecondsPerMinute = 60000;
const thirtyTwoMegabytes = 34359738368;
const defaultDelay = millisecondsPerMinute/4;
const commentString = "comment";
const voteString = "vote";
const ensureBuffer = function(input){
	if (typeof input=="string"){
		return Buffer.from(input, 'utf8');
	}
	if (Buffer.isBuffer(input)){
		return input;
	}
	return ensureBuffer(JSON.stringify(input));
};
const maliciousObject = {
	"data": {
		"type": voteString, 
		"attributes": {
			"verdict": output.malicious
		}
	}
};
const harmlessObject = {
	"data": {
		"type": voteString, 
		"attributes": {
			"verdict": output.harmless
		}
	}
};
const commentToObject = function(input){
	return {
		"data": {
			"type": commentString,
			"attributes": {
				"text": input
			}
		}
	};
};
const makeURLForm = function(input){
	return {url: input};
};
const makeFileForm = function(input){
	return {file: input};
};
const makeVoteObject = function(input){
	switch (input) {
		case output.malicious:
			return maliciousObject;
		case output.harmless:
			return harmlessObject;
		default:
	};
	throw new Error(invalidVoteString);
};
const standardCallback = function(input){
	const callback = input;
	return function(err, res, body){
		if (err) {
			callback(err);
			return;
		}
		if (res.statusCode > 399) {
			callback(body);
			return;
		}
		if (body.error) {
			callback(body);
			return;
		}
		callback(null, body);
	};
};
const makePostTransform = function(initialFunction, bodyModification){
	return function(id, content, callback){
		const modded = bodyModification(content);
		return initialFunction(id, modded, callback);
	};
};
const makePlainZipFileObject = function(input){
	return {data:{
		hashes: input
	}};
};
const makePasswordZipFileObject = function(password, files){
	return {data:{
		password: password, 
		hashes: files
	}};
};
const invalidVoteString = "Invalid vote string";
const filesLink = "https://www.virustotal.com/api/v3/files";
const bigFileLink = "https://www.virustotal.com/api/v3/files/upload_url";
const defaultKey = "e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d";
output.relationships = {
	comments: 'comments',
	communicating_files: 'communicating_files',
	downloaded_files: 'downloaded_files',
	graphs: 'graphs',
	historical_whois: 'historical_whois',
	referrer_files: 'referrer_files',
	resolutions: 'resolutions',
	urls: 'urls',
	siblings: 'siblings',
	referrer_files: 'referrer_files',
	historical_whois: 'historical_whois',
	analyses: 'analyses',
	last_serving_ip_address: 'last_serving_ip_address',
	redirecting_urls: 'redirecting_urls',
	submissions: 'submissions',
	analyses: 'analyses',
	behaviours: 'behaviours',
	bundled_files: 'bundled_files',
	carbonblack_children: 'carbonblack_children',
	carbonblack_parents: 'carbonblack_parents',
	comments: 'comments',
	compressed_parents: 'compressed_parents',
	contacted_domains: 'contacted_domains',
	contacted_ips: 'contacted_ips',
	contacted_urls: 'contacted_urls',
	email_parents: 'email_parents',
	embedded_domains: 'embedded_domains',
	embedded_ips: 'embedded_ips',
	execution_parents: 'execution_parents',
	itw_urls: 'itw_urls',
	overlay_parents: 'overlay_parents',
	pcap_parents: 'pcap_parents',
	pe_resource_parents: 'pe_resource_parents',
	similar_files: 'similar_files',
	submissions: 'submissions',
	screenshots: 'screenshots',
	votes: 'votes'
};
const v3 = function(delay){
	if (delay==null) {
		delay=defaultDelay;
	}
	this.time = delay; 
	this.key = defaultKey;
	const self = this;
	const standardHeader = {'x-apikey': defaultKey};
	this.getKey = function(){
		return standardHeader['x-apikey'];
	};
	this.setKey = function(k){
		standardHeader['x-apikey'] = k;
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
					headers: standardHeader
				}, standardCallback(callback));
			});
			return self;
		};
	};
	const make3partGetFunction = function(beforePath, middlePath, afterPath){
		return function(contentID, secondID, cb){
			const id = contentID;
			const sid = secondID;
			const callback = cb;
			putInLine(function(){
				request({
					url: beforePath + id + middlePath + sid + afterPath,
					method: getString,
					headers: standardHeader
				}, standardCallback(callback));
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
					headers: standardHeader,
					body: JSON.stringify(body)
				}, standardCallback(callback));
			});
			return self;
		};
	};
	const makeRawPostFunction = function(beforePath, afterPath){
		return function(contentID, contents, cb){
			const body = contents;
			const id = contentID;
			const callback = cb;
			putInLine(function(){
				request({
					url: beforePath + id + afterPath,
					method: postString,
					headers: standardHeader,
					body: body
				}, standardCallback(callback));
			});
			return self;
		};
	};
	const makeRawPostFormFunction = function(beforePath, modifier){
		return function(input, cb){
			const form = input;
			const callback = cb;
			putInLine(function(){
				request({
					url: beforePath,
					method: postString,
					headers: standardHeader,
					form: modifier(form)
				}, standardCallback(callback));
			});
			return self;
		};
	};

	const uploadFileToURL = function(content, location, callback){
		request({
			url: location,
			method: postString,
			headers: standardHeader,
			form: makeFileForm(content)
		}, standardCallback(callback));
	};

	this.uploadFile = function(input, callback){
		const asBuffer = ensureBuffer(input);
		putInLine(function(){
			if (asBuffer.length < thirtyTwoMegabytes) {
				uploadFileToURL(asBuffer, filesLink,callback);
				return;
			}
			request({
				url: bigFileLink,
				method: getString,
				headers: standardHeader
			}, standardCallback(function(err, res){
				if (err){
					callback(err);
					return;
				}
				putInLine(function(){
					uploadFileToURL(asBuffer, res.data, callback);
				});
			}));
		});
		return self;
	};
	this.downloadMaliciousFile = function(contentID, cb){
		const target = contentID;
		const callback = cb;
		request({
			url: target,
			method: getString
		}, function(error, response, body){
			if (err) {
				callback(err);
				return;
			}
			if (res.statusCode > 399) {
				callback(body);
				return;
			}
			callback(null, body);
		});
		return self;
	};
	this.getFileDownloadLink = makeGetFunction("https://www.virustotal.com/api/v3/files/","/download_url");
	this.fileBehaviours = makeGetFunction("https://www.virustotal.com/api/v3/file_behaviours/","/pcap");
	this.reAnalyzeFile = makePostFunction("https://www.virustotal.com/api/v3/files/","/analyze");
	this.fileVotesLookup = makeGetFunction("https://www.virustotal.com/api/v3/files/","/votes");
	this.postFileComment = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/urls/","/comments"), commentToObject);
	this.sendFileVote = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/files/","/votes"), makeVoteObject);
	this.fileCommentLookup = makeGetFunction("https://www.virustotal.com/api/v3/files/","/comments");
	this.fileLookup = makeGetFunction("https://www.virustotal.com/api/v3/files/","");
	this.getFileRelationships = make3partGetFunction("https://www.virustotal.com/api/v3/urls/","/","");
	this.ipLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","");
	this.domainLookup = makeGetFunction("https://www.virustotal.com/api/v3/domains/","");
	this.ipCommentLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","/comments");
	this.domainCommentLookup = makeGetFunction("https://www.virustotal.com/api/v3/domains/","/comments");
	this.ipVotesLookup = makeGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","/votes");
	this.domainVotesLookup = makeGetFunction("https://www.virustotal.com/api/v3/domains/","/votes");
	this.postIPcomment = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/ip_addresses/","/comments"), commentToObject);
	this.postDomainComment = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/domains/","/comments"), commentToObject);
	this.sendIPvote = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/ip_addresses/","/votes"), makeVoteObject);
	this.sendDomainVote = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/domains/","/votes"), makeVoteObject);
	this.getIPrelationships = make3partGetFunction("https://www.virustotal.com/api/v3/ip_addresses/","/","");
	this.getDomainRelationships = make3partGetFunction("https://www.virustotal.com/api/v3/domains/","/","");
	this.initialScanURL = makeRawPostFormFunction("https://www.virustotal.com/api/v3/urls",makeURLForm);
	this.urlLookup = makeGetFunction("https://www.virustotal.com/api/v3/urls/","");
	this.urlCommentLookup = makeGetFunction("https://www.virustotal.com/api/v3/urls/","/comments");
	this.urlNetworkLocations = makeGetFunction("https://www.virustotal.com/api/v3/urls/","/network_location");
	this.urlVotesLookup = makeGetFunction("https://www.virustotal.com/api/v3/urls/","/votes");
	this.postURLComment = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/urls/","/comments"), commentToObject);
	this.sendURLVote = makePostTransform(makePostFunction("https://www.virustotal.com/api/v3/urls/","/votes"), makeVoteObject);
	this.getURLRelationships = make3partGetFunction("https://www.virustotal.com/api/v3/urls/","/","");
	this.reAnalyzeURL = makePostFunction("https://www.virustotal.com/api/v3/urls/","/analyze");
	this.getAnalysisInfo = makeGetFunction("https://www.virustotal.com/api/v3/analyses/","");
	this.getUserInfo = makeGetFunction("https://www.virustotal.com/api/v3/users/","");
	this.getUserUsageInfo = makeGetFunction("https://www.virustotal.com/api/v3/users/","/api_usage");
	this.getGroupInfo = makeGetFunction("https://www.virustotal.com/api/v3/groups/","");
	this.getGroupRelationships = make3partGetFunction("https://www.virustotal.com/api/v3/groups/","/relationships/","");
	this.getGroupAdministrators = makeGetFunction("https://www.virustotal.com/api/v3/groups/","/administrators");

	this.getZipFileInfo = makeGetFunction("https://www.virustotal.com/api/v3/intelligence/zip_files/","");
	this.getZipFileDownloadLink = makeGetFunction("https://www.virustotal.com/api/v3/intelligence/zip_files/","/download_url");
	this.downloadZipFile = this.downloadMaliciousFile;
	this.makePlainTextZipFile = makeRawPostFormFunction(makeZipFileLink, makePlainZipFileObject);
	this.makePasswordZipFile = function(password, files, callback){
		const body = JSON.stringify(makePasswordZipFileObject(password, files));
		putInLine(function(){
			request({
				url: makeZipFileLink,
				method: postString,
				headers: standardHeader,
				body: body
			}, standardCallback(callback));
		});
		return self;
	};
	
};
output.makeAPI = function(delay){
	return new v3(delay);
};
module.exports = exports = output;