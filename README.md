# node-virustotal
VirusTotal API for Node JS

## Install Instructions
Note: for reasons involving future features, it is recommended that you use the global installation. Both procedures work though.

### Local Directory

In the directory in question, run this command:

```
npm install node-virustotal
```

### Global

Assuming you have the rights to do so, run this command:

```
npm install -g node-virustotal
```

## Background Information

Virustotal is a service provided by Google which provides supplemental malware analysis and address analysis. Go here for more information: https://www.virustotal.com/ . This module simplifies the process of interacting with Virustotal from a Node.js perspective. This API comes with a working public API key, but users should get their own and use that instead. It also uses the default key for the honeypot API. This must be changed.

This API provides factory methods which make connection objects, which act as job queues.

## MakePublicConnection
This function makes a new public connection object, using public API version 2.

### PublicConnection.setKey()
This function takes a hexadecimal string, and attempts to use said string as the API key for tasks in the queue.

### PublicConnection.getKey()
This function returns the key that the connection is currently using.

### PublicConnection.setDelay()
This function takes an integer, sets the delay between any two jobs performed by the connection object to said integer. By default, this is 15000 milliseconds. This should not be changed unless you have specific permission from VirusTotal.

### PublicConnection.getDelay()
This function returns the delay between any two jobs performed by the connection. By default, this is 15000.

### PublicConnection.checkIPv4()
This function takes 3 parameters: an IPv4 address, a function to perform if a result is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It analyzes a particular IP address.

### PublicConnection.getDomainReport()
This function takes 3 parameters: a DNS address "without the protocol", a function to perform if a result is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It analyzes a domain name.

### PublicConnection.submitUrlForScanning()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It submits a URL for the analysis queue.

### PublicConnection.retrieveUrlAnalysis()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It checks to see if the report on a given URL is done, and continues checking until it's done or an error happens. This can take hours, so DO NOT USE THIS FOR ANYTHING WITH A CLIENT RESPONSE!

### PublicConnection.retrieveUrlAnalysisWithRescan()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. This does the same thing as retrieveUrlAnalysis, but it also requests that the URL in question be rescanned.

### PublicConnection.publishUrlComment()
This function takes 4 parameters: A full URL "with the protocol", a comment about it, a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The URLs are the same as for submitUrlForScanning and retrieveUrlAnalysis. Read the Virustotal API documentation for information about what a useful comment is. The confirmation function is business as usual. The error function is optional. If the error function is not specified, the script will simply keep attempting to submit the comment.

### PublicConnection example

```
var vt = require("node-virustotal");
var con = vt.MakePublicConnection();
con.setKey("e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d");
console.log(con.getKey());
con.setDelay(15000);
console.log(con.getDelay());
con.checkIPv4("90.156.201.27",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.getDomainReport("wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.submitUrlForScanning("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.retrieveUrlAnalysis("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.publishUrlComment("http://wikionemore.com", "Ignore this comment. I'm just testing an API.", function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
/*Sidenote: That's a real phishing site. It was shut down, but I still advise against going to it.*/
```

## MakeHoneypot2Connection
This function makes a new honeypot 2 connection object, using public API version 2, with honeypot permissions. You can contact VirusTotal to get the honeypot permission for a particular API key. This is based on public API version 2, not version 1.

### Honeypot2Connection.setKey()
This function takes a hexadecimal string, and attempts to use said string as the API key for tasks in the queue. This must be used before any tasks are performed.

### Honeypot2Connection.getKey()
This function returns the key that the connection is currently using.

### Honeypot2Connection.setDelay()
This function takes an integer, sets the delay between any two jobs performed by the connection object to said integer. By default, this is 1000 milliseconds. This should not be changed unless you have specific permission from VirusTotal.

### Honeypot2Connection.getDelay()
This function returns the delay between any two jobs performed by the connection. By default, this is 1000.

### Honeypot2Connection.checkIPv4()
This function takes 3 parameters: an IPv4 address, a function to perform if a result is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind.

### Honeypot2Connection.getDomainReport()
This function takes 3 parameters: a DNS address "without the protocol", a function to perform if a result is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind.


### Honeypot2Connection.submitUrlForScanning()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It submits a URL for the analysis queue.

### Honeypot2Connection.retrieveUrlAnalysis()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. It checks to see if the report on a given URL is done, and continues checking until it's done or an error happens. This can take hours, so DO NOT USE THIS FOR ANYTHING WITH A CLIENT RESPONSE!

### Honeypot2Connection.retrieveUrlAnalysisWithRescan()
This function takes 3 parameters: a URL for scanning "with the protocol", a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind. This does the same thing as retrieveUrlAnalysis, but it also requests that the URL in question be rescanned.

### Honeypot2Connection.publishUrlComment()
This function takes 4 parameters: A full URL "with the protocol", a comment about it, a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The URLs are the same as for submitUrlForScanning and retrieveUrlAnalysis. Read the Virustotal API documentation for information about what a useful comment is. The confirmation function is business as usual. The error function is optional. If the error function is not specified, the script will simply keep attempting to submit the comment.

### Honeypot2Connection example

```
var vt = require("node-virustotal");
var con = vt.MakeHoneypot2Connection();
con.setKey("e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d");
console.log(con.getKey());
con.setDelay(15000);
console.log(con.getDelay());
con.checkIPv4("90.156.201.27",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.getDomainReport("wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.submitUrlForScanning("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.retrieveUrlAnalysis("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.publishUrlComment("http://wikionemore.com", "Ignore this comment. I'm just testing an API.", function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
/*Sidenote: That's a real phishing site. It was shut down, but I still advise against going to it.*/
```

## Security Notes
The Virustotal API supports both HTTP and HTTPS. This API only uses HTTPS.

The Virustotal API supports 3 hash algorithms: MD5, SHA1, and SHA256 "A member of the SHA2 family". MD5 is well known to be broken. SHA1 is theorized to have collisions, though none are known. SHA2 is not widely regarded as flawed, but was published by the US NSA, so make what you will of that.

The site mentioned in the example code is a known phishing site. It was shut down, but I still advise against going to it. It is used here because it makes an easy to understand example.
