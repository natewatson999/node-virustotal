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

The VirusTotal API has 2 tiers: free and premium. The free API has a limit of 4 calls per minute, or one every 15000 milliseconds. Consequently, node-virustotal uses a task queue internally. 

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

## v3.ipCommentLookup()
This takes an IPv4 address and a standard callback. The comments regarding the IPv4 address are looked up in VirusTotal's database, and the information is returned in res. This returns this instance of the v3 object. 

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

## Security And Legal Notes
This API only uses HTTPS.

The VirusTotal API supports 3 hash algorithms: MD5, SHA1, and SHA256 "A member of the SHA2 family". MD5 and SHA1 are well known to be broken. The SHA2 family is not widely regarded as flawed, but was published by the US NSA, so make what you will of that. Wherever possible, this API prefers to use SHA256, however there are no known incompatibilities with the other 2 algorithms unless otherwise stated.

The site mentioned in the example code is a known phishing site. It was shut down, but I still advise against going to it. It is used here because it makes an easy to understand example. The IP addresses mentioned are all of a well known DNS server. 

The author(s) of this API are not responsible for the contents of VirusTotal's information, third party information, third party comments, or malware. This API is not safe or intended for mission critical systems, nor is it safe or intended for safety critical systems.

All of this code is under the MIT license; with the possible exceptions of the modules, which are under their own licenses, which should be readable in their documentation. While this code is under the MIT license, the VirusTotal REST API is under a custom license which should be read separately, before attempting to use this API.