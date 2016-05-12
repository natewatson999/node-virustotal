var https = require("https");
var yellowStream = require("yellow-stream");
var apiKey = "e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d";
var features = {};
var PublicConnection = function(){
	var key = apiKey;
	var jobDelay = 15000;
	this.setKey = function(replacement){
		key = replacement;
		return;
	};
	this.getKey = function() {
		return key;
	};
	this.setDelay = function(replacement){
		jobDelay = replacement;
		return;
	};
	this.getDelay = function() {
		return jobDelay;
	};
	var jobQueue = null;
	var tail = null;
	var performNextJob = function(){
		if (jobQueue != null) {
			var workingJob = jobQueue;
			jobQueue = jobQueue.next;
			if (jobQueue == null) {
				tail = null;
			} else {
				setTimeout(performNextJob, jobDelay);
			}
			workingJob.proc();
		}
		return;
	};
	var addJob = function(proc) {
		if (jobQueue == null) {
			jobQueue = {
				proc: proc,
				next: null
			};
			tail = jobQueue;
			setTimeout(performNextJob, jobDelay);
		} else {
			tail.next = {
				proc: proc,
				next: null
			};
			tail = tail.next;
		}
		return;
	};
	this.checkIPv4 = function(addr, responseProc, errProc){
		var checkURL = "https://www.virustotal.com/vtapi/v2/ip-address/report?ip=" + addr + "&apikey=" + key;
		var checkProc = function(){
			https.get(checkURL, function(raw){
				var stream = new yellowStream.consolidator(raw);
				stream.on("error", function(e){
					errProc(e);
				});
				stream.on("end", function(data){
					var response = JSON.parse(data);
					switch(response.response_code) {
						case -2:
							addJob(checkProc);
							return;
						case 0:
						case 1:
							responseProc(data);
							return;
						case -1:
						default:
							errProc(data);
							return;
					}
				});
			});
		};
		addJob(checkProc);
	};
	return;
};
features.MakePublicConnection = function(){
	return new PublicConnection();
};
module.exports = exports = features;
