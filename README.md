# node-virustotal

VirusTotal API for Node JS

## Install Instructions

### Local Install Instructions

In the directory that is appropriate, run this command:

```
npm install node-virustotal
```

### Global Install Instructions

Wherever you can, run this command:

```
npm install -g node-virustotal
```

## Background Information

VirusTotal is a service provided by Google which provides supplemental malware analysis and address analysis. Go here for more information: https://www.virustotal.com/ . This module simplifies the process of interacting with VirusTotal from a Node.js perspective. This API comes with a working API key, but users should get their own and use that instead.

Fair warning, this documentation is extremely long, so if you need to pee or need coffee; do so or brew it before you start reading this.

The VirusTotal API has 2 tiers: free and premium. The free API has a limit of 4 calls per minute, or one every 15000 milliseconds. Consequently, node-virustotal uses a task queue internally. If you have the premium API, this will still work, however the premium-specific features may be buggy due to the lack of possibility of testing, and you may wish to adjust the time between API calls. 

## Old Versions

VirusTotal has made some incompatible changes with their APIs as of verison 3. For this reason, this API has also had to change. The 3.0+ versions of this API are incompatible with the pre-3.0 releases. To minimize breakage and issues, there is a section of the API to directly use the pre-3.0 versions. The pre-3.0 sections will no longer be maintained but will not be removed. The documentation for the pre-3.0 versions can be found in RepoLinkHere/oldREADME.md.

## nvt.legacyEdition()

For compatibility, legacyEdition() provides the old version of this API. See RepoLinkHere/oldREADME.md for the documentation for the old API.

### Example
```
//This is how the legacy version can be accessed in the current version:
const oldVT = require('node-virustotal').legacyEdition();

//Aside from deprecation by VirusTotal itself, this is identical in functionality to the following in the old versions:
var oldVT = require('node-virustotal');
```

## nvt.harmless
This is a string with a value of "harmless".

## nvt.malicious
This is a string with a value of "malicious".

## nvt.relationships
This is an object to the following specification: 

```
{
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
}
```

## nvt.sha256()

This takes a string and returns a hexadecimal representation of the SHA256 hash of the string.
```
const hashed = require('node-virustotal').sha256('http://wikionemore.com/');
console.log(hashed); //prints 6a106dcb91cc315397c96c39758ff724e53ea0329daf2eaeccbb65820b73c97e
```

## nvt.makeAPI()

This optionally takes an integer which is a number of milliseconds, and returns a V3 object. A V3 object is how most standard interaction with VirusTotal occurs. By default, this includes a working free-use API key. It is encouraged that the key be changed to a personal one. As of this writing, not all of the VirusTotal API is currently supported due to the rewrite. What is supported can be accessed in this method. 

### Example

```
const nvt = require('node-virustotal');
const slowInstance = nvt.makeAPI(20000);
const defaultTimedInstance = nvt.makeAPI();
```

## Callbacks

All functions which take a callback as a parameter use the following specification for the callback, unless otherwise specified.
```
const standardCallback = function(err, res){
  //This function may or may not return something. It doesn't matter which. 
  //err is an error object which may or may not be null.
  //If the function has executed correctly, res is a result object. The schema of this object varies between calls. 
};
```

## v3.getKey()
This returns the API key of this instance of a v3 object.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
console.log(defaultTimedInstance.getKey());
```

## v3.setKey()
This takes a String which is a valid VirusTotal API key, sets the API key of this instance of a v3 object, and returns this instance of the v3 object.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setKey('e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d');
```

## v3.getDelay()
This returns the time in milliseconds between API calls of this instance of a v3 object.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
console.log(defaultTimedInstance.getDelay());
```

## v3.setDelay()
This takes an integer which is indicates how many milliseconds to wait between API calls, sets the internal delay as such, and returns this instance of the v3 object.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameKey = defaultTimedInstance.setDelay(15000);
```


## v3.uploadFile()
This takes the contents of a potentially risky file in either string or Buffer form "Buffer is preferred" and a standard callback. The file is sent to VirusTotal for analysis, and the information regarding the pending analysis is returned in res. This returns this instance of the v3 object. Note that if your file's contents are at least 32 megabytes in size, this will take 2 uses of the internal task queue instead of the usual 1. This is because such files take 2 interactions with VirusTotal's interface.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const aMaliciousFile = require('fs').readFileSync('./aMaliciousFile.exe');
const theSameObject = defaultTimedInstance.uploadFile(aMaliciousFile, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.domainLookup()
This takes a domain and a standard callback. The domain is looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.domainLookup('wikionemore.com', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.fileLookup()
This takes a file ID and a standard callback. The file is looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.fileLookup('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.urlLookup()
This takes a SHA256 hashed URL and a standard callback. The URL is looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.urlLookup(hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.ipLookup()
This takes an IPv4 address and a standard callback. The IPv4 address is looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.ipLookup('8.8.8.8', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.domainCommentLookup()
This takes a domain and a standard callback. The comments regarding the domain are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.domainCommentLookup('wikionemore.com', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.fileCommentLookup()
This takes a file ID and a standard callback. The comments regarding the file are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.fileCommentLookup('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.urlCommentLookup()
This takes a SHA256 hashed URL and a standard callback. The comments regarding the URL are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.urlCommentLookup(hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.urlNetworkLocations()
This takes a SHA256 hashed URL and a standard callback. The network locations regarding the URL are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.urlNetworkLocations(hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.initialScanURL()
This takes a URL and a standard callback. This causes VirusTotal to initially analyze the URL. The information regarding the analysis is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.initialScanURL('http://wikionemore.com', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.reAnalyzeFile()
This takes a file ID and a standard callback. This causes VirusTotal to reanalyze the file. The information regarding the analysis is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.reAnalyzeFile('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.reAnalyzeURL()
This takes a SHA256 hashed URL and a standard callback. This causes VirusTotal to reanalyze the URL. The information regarding the analysis is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.reAnalyzeURL(hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.fileBehaviours()
This takes a sandbox ID and a standard callback. This ID can be obtained from getFileRelationships with the nvt.behaviors option. The PCAP regarding the sandbox is looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.fileBehaviours('NjY0MjRlOTFjMDIyYTkyNWM0NjU2NWQzYWNlMzFmZmI6MTQ3NTA0ODI3NwaafdsJJK', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.ipCommentLookup()
This takes an IPv4 address and a standard callback. The comments regarding the IPv4 address are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.ipCommentLookup('8.8.8.8', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getIPrelationships()
This takes an IPv4 address, a relationship, and a standard callback. The relationships regarding the IPv4 address are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. The relationship should be a member variable of nvt.relationships.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.getIPrelationships('8.8.8.8', nvt.relationships.graphs, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getFileRelationships()
This takes a file hash ID, a relationship, and a standard callback. The relationships regarding the file are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. The relationship should be a member variable of nvt.relationships.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.getFileRelationships('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', nvt.relationships.graphs, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getDomainRelationships()
This takes a domain, a relationship, and a standard callback. The relationships regarding the domain are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. The relationship should be a member variable of nvt.relationships.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.getDomainRelationships('wikionemore.com', nvt.relationships.graphs, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getURLRelationships()
This takes a SHA256 hashed URL, a relationship, and a standard callback. The relationships regarding the domain are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. The relationship should be a member variable of nvt.relationships.

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.getURLRelationships(hashed, nvt.relationships.graphs, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.ipVotesLookup()
This takes an IPv4 address and a standard callback. The votes regarding the IPv4 address are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.ipVotesLookup('8.8.8.8', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.domainVotesLookup()
This takes a domain and a standard callback. The votes regarding the domain are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.domainVotesLookup('wikionemore.com', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.fileVotesLookup()
This takes a file ID and a standard callback. The votes regarding the file are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.fileVotesLookup('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getAnalysisInfo()
This takes an analysis ID and a standard callback. The votes regarding the analysis are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.getAnalysisInfo('<string>', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.urlVotesLookup()
This takes a SHA256 hashed URL and a standard callback. The votes regarding the URL are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.urlVotesLookup(hashed, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.postIPcomment()
This takes an IPv4 address, a string comment, and a standard callback. The comment regarding the IPv4 address is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.postIPcomment('8.8.8.8',"This address is safe. I'm just testing an API", function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.postDomainComment()
This takes a domain, a string comment, and a standard callback. The comment regarding the domain is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.postDomainComment('wikionemore.com',"This domain is malicious. I'm just testing an API", function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.postURLComment()
This takes a SHA256 hashed URL, a string comment, and a standard callback. The comment regarding the URL is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.postURLComment(hashed,"This URL is malicious. I'm just testing an API", function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.postFileComment()
This takes a file ID, a string comment, and a standard callback. The comment regarding the file is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.postFileComment('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85',"This URL is malicious. I'm just testing an API", function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.sendIPvote()
This takes an IPv4 address, a vote, and a standard callback. The vote regarding the IPv4 address is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. The vote must either be nvt.malicious or nvt.harmless. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.postIPcomment('8.8.8.8', nvt.malicious, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.sendDomainVote()
This takes a domain, a vote, and a standard callback. The vote regarding the domain is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. The vote must either be nvt.malicious or nvt.harmless. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.sendDomainVote('wikionemore.com', nvt.malicious, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.sendFileVote()
This takes a file ID, a vote, and a standard callback. The vote regarding the file is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. The vote must either be nvt.malicious or nvt.harmless. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const theSameObject = defaultTimedInstance.sendFileVote('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', nvt.malicious, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.sendURLVote()
This takes a SHA256 hashed URL, a vote, and a standard callback. The vote regarding the domain is posted to VirusTotal's database, and the response is returned in res. This returns this instance of the v3 object. The vote must either be nvt.malicious or nvt.harmless. 

### Example

```
const nvt = require('node-virustotal');
const defaultTimedInstance = nvt.makeAPI();
const hashed = nvt.sha256('http://wikionemore.com/');
const theSameObject = defaultTimedInstance.sendURLVote(hashed, nvt.malicious, function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  console.log(JSON.stringify(res));
  return;
});
```

## v3.getFileDownloadLink() and v3.downloadMaliciousFile()
v3.getFileDownloadLink() takes a file ID and a standard callback. It then asks VirusTotal for a link to download the corresponding file. Note that, due to hash collisions, MD5 and SHA1 IDs are HEAVILY discouraged for this method. If the request is processed properly and the API key is one with permission to download malware, then a link will be returned in a standard callback. This link is valid for 1 hour. 

The file can be downloaded with v3.downloadMaliciousFile(). downloadMaliciousFile takes a link and a standard callback. It then asks for VirusTotal to send the contents of the file corresponding with the link. If the request is processed properly, then the file contents will be returned in a standard callback. Note that this method is extremely dangerous and should NEVER be used on a system which has confidential, secure, financial, or medical information.

Both functions return this instance of a v3 object. 

### Example

```
const nvt = require('node-virustotal');
const premiumAccess = nvt.makeAPI().setKey('Oh, you have a premium key? I hate you.');
const theSameObject = premiumAccess.getFileDownloadLink('8739c76e681f900923b900c9df0ef75cf421d39cabb54650c4b9ad19b6a76d85', function(err, res){
  if (err) {
    console.log('Well, crap.');
    console.log(err);
    return;
  }
  const theActualFileLink = res.data;
  premiumAccess.downloadMaliciousFile(theActualFileLink, function(err2, maliciousData){
    if (err2) {
      console.log('Well, crap.');
      console.log(err2);
      return;
    }
    //Do whatever you want that is legal with maliciousData.
  });
});
```

## Security And Legal Notes
This API only uses HTTPS.

The VirusTotal API supports 3 hash algorithms: MD5, SHA1, and SHA256 "A member of the SHA2 family". MD5 and SHA1 are well known to be broken. The SHA2 family is not widely regarded as flawed, but was published by the US NSA, so make what you will of that. Wherever possible, this API prefers to use SHA256, however there are no known incompatibilities with the other 2 algorithms unless otherwise stated.

The site mentioned in the example code is a known phishing site. It was shut down, but I still advise against going to it. It is used here because it makes an easy to understand example. The IP addresses mentioned are all of a well known DNS server. 

The author(s) of this API are not responsible for the contents or effects of VirusTotal's information, third party information, third party comments, or malware. This API is not safe or intended for mission critical systems, nor is it safe or intended for safety critical systems.

All of this code is under the MIT license; with the possible exceptions of the modules, which are under their own licenses, which should be readable in their documentation. While this code is under the MIT license, the VirusTotal REST API is under a custom license which should be read separately, before attempting to use this API.