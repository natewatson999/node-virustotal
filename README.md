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

### PublicConnection.submitFileForAnalysis()
This takes 5 parameters: a file's name "as found in the wild", a mime type "ideally as specific as possible", the actual content of the file, a function to execute when a confirmation is received, and a function to perform if an error happens. The two functions each take a single parameter, which can either be the confirmation information or the error, as appropriate. The confirmation will be an object, and the error might be an object. This function is to submit a file for analysis by Virustotal. Part of the response will be a set of identifiers for the file.

### PublicConnection.rescanFile()
rescanFile() asks Virustotal to rescan a file which has already been submitted. This function takes 3 parameters: a hashcode, a function to perform if a normal response is received, and a function to perform if an error happens. The hashcode must be either an MD5, SHA1, or SHA256 code of the file being rescanned. None of these options are good hash algorithms, but MD5 and SHA1 are worse than SHA256. The two functions each have one parameter. The parameters are similar to the other functions.

### PublicConnection.getFileReport()
getFileReport() asks Virustotal for the report of a file that was previously submitted. It takes 3 or 4 parameters. The first parameter is the file's identification. See the documentation for rescanFile() for the identification. The next two parameters are the usual response and error functions. The 4th parameter is optional this can be used to request the report for a specific scan_id of a file, rather than simply the latest scanjob. This is useful if multiple versions exist, or if there's a hash collision. The scan_id can be obtained from the result of submitFileForAnalysis. By default, if Virustotal reports that the file in question hasn't been scanned yet, then this function will continue to request reports until one is obtained or an error happens. This requesting process happens within the bounds of the job queueing system that the rest of this API uses. However, depending on Virustotal's load, this can take hours, so whatever you do, don't use this for real time responses.

### PublicConnection.publishFileComment()
This function takes 4 parameters: A file identifier, a comment about it, a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The file identifier can be either an MD5, SHA1, or SHA256 hashcode of the file in question. None of these are recommended, but MD5 and SHA1 are worse. These hashcodes can be obtained from the confirmation from submitFileForAnalysis. Read the Virustotal API documentation for information about what a useful comment is. The confirmation function is business as usual. The error function is optional. If the error function is not specified, the script will simply keep attempting to submit the comment.

### PublicConnection.UrlEvaluation()
This function is a convenience function which combines submitUrlForScanning and retrieveUrlAnalysis. This takes a URL which may or may not have been scanned in the past, cues it for scanning, waits for the scanning to be finished, and outputs the scan results. This function takes 3 parameters: a URL, a result callback function, and an error function. The URL should have the protocol. The result callback function has the same output as retrieveUrlAnalysis. The error function is mandatory, and is under the same rules as all of the other error functions in the public API.

### PublicConnection.FileEvaluation()
This is a convenience function which combines submitFileForAnalysis and getFileReport. Basically, this function lets the developer submit a file for analysis, and get the analysis without any intermediate work. The parameters are identical to those of submitFileForAnalysis, except the response callback function fires when the file has been analyzed by Virustotal, rather than merely submitted. Depending on Virustotal's traffic, the evaluation process can take up to 2 hours to finish, so it's a really bad idea to use this for anything approaching real-time.

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
con.submitFileForAnalysis("obvious_virus.svg", "text/svg", fs.readFileSync("./obvious_virus.svg"), function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.rescanFile("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.getFileReport("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.publishFileComment("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", "Ignore this comment. I'm just testing an API.", function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.UrlEvaluation("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.FileEvaluation("obvious_virus.svg", "text/svg", fs.readFileSync("./obvious_virus.svg"), function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
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

### Honeypot2Connection.submitFileForAnalysis()
This takes 5 parameters: a file's name "as found in the wild", a mime type "ideally as specific as possible", the actual content of the file, a function to execute when a confirmation is received, and a function to perform if an error happens. The two functions each take a single parameter, which can either be the confirmation information or the error, as appropriate. The confirmation will be an object, and the error might be an object. This function is to submit a file for analysis by Virustotal. Part of the response will be a set of identifiers for the file.

### Honeypot2Connection.rescanFile()
rescanFile() asks Virustotal to rescan a file which has already been submitted. This function takes 3 parameters: a hashcode, a function to perform if a normal response is received, and a function to perform if an error happens. The hashcode must be either an MD5, SHA1, or SHA256 code of the file being rescanned. None of these options are good hash algorithms, but MD5 and SHA1 are worse than SHA256. The two functions each have one parameter. The parameters are similar to the other functions.

### Honeypot2Connection.getFileReport()
getFileReport() asks Virustotal for the report of a file that was previously submitted. It takes 3 or 4 parameters. The first parameter is the file's identification. See the documentation for rescanFile() for the identification. The next two parameters are the usual response and error functions. The 4th parameter is optional this can be used to request the report for a specific scan_id of a file, rather than simply the latest scanjob. This is useful if multiple versions exist, or if there's a hash collision. The scan_id can be obtained from the result of submitFileForAnalysis. By default, if Virustotal reports that the file in question hasn't been scanned yet, then this function will continue to request reports until one is obtained or an error happens. This requesting process happens within the bounds of the job queueing system that the rest of this API uses. However, depending on Virustotal's load, this can take hours, so whatever you do, don't use this for real time responses.

### Honeypot2Connection.publishFileComment()
This function takes 4 parameters: A file identifier, a comment about it, a function to perform if a confirmation is obtained, and a function to perform if an error is obtained. The file identifier can be either an MD5, SHA1, or SHA256 hashcode of the file in question. None of these are recommended, but MD5 and SHA1 are worse. These hashcodes can be obtained from the confirmation from submitFileForAnalysis. Read the Virustotal API documentation for information about what a useful comment is. The confirmation function is business as usual. The error function is optional. If the error function is not specified, the script will simply keep attempting to submit the comment.

### Honeypot2Connection.UrlEvaluation()
This function is a convenience function which combines submitUrlForScanning and retrieveUrlAnalysis. This takes a URL which may or may not have been scanned in the past, cues it for scanning, waits for the scanning to be finished, and outputs the scan results. This function takes 3 parameters: a URL, a result callback function, and an error function. The URL should have the protocol. The result callback function has the same output as retrieveUrlAnalysis. The error function is mandatory, and is under the same rules as all of the other error functions in the public API.

### Honeypot2Connection.FileEvaluation()
This is a convenience function which combines submitFileForAnalysis and getFileReport. Basically, this function lets the developer submit a file for analysis, and get the analysis without any intermediate work. The parameters are identical to those of submitFileForAnalysis, except the response callback function fires when the file has been analyzed by Virustotal, rather than merely submitted. Depending on Virustotal's traffic, the evaluation process can take up to 2 hours to finish, so it's a really bad idea to use this for anything approaching real-time.

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
con.submitFileForAnalysis("obvious_virus.svg", "text/svg", fs.readFileSync("./obvious_virus.svg"), function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.rescanFile("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.getFileReport("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.publishFileComment("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", "Ignore this comment. I'm just testing an API.", function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.UrlEvaluation("http://wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.FileEvaluation("obvious_virus.svg", "text/svg", fs.readFileSync("./obvious_virus.svg"), function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
/*Sidenote: That's a real phishing site. It was shut down, but I still advise against going to it.*/
```

## makePrivateConnection
This returns a new privateConnection object, using private API version 2. I was not able to get permissions for the private key, so only about half of the features in this section are tested. A good rule of thumb is that if you can't find a function in the public and honeypot APIs that does the same thing as the function you're reading about; then the function you're reading about probably isn't tested. Unlike the public and honeypot connections, this lacks any kind of task spooling, instead it simply executes everything as soon as possible.

### makePrivateConnection.setKey()
This function sets the apikey that the connection is using. It takes one parameter: the API key. It returns the connection object.

### makePrivateConnection.getKey()
This function returns the API key that the connection is using. It has no parameters.

### makePrivateConnection.publishUrlComment()
The interaction with this version of publishUrlComment is identical to the interaction with the same method in the public and honeypot API. The only difference is a lack of task spooling, so it has a chance of taking less than 15 seconds to run.

### makePrivateConnection.publishFileComment()
The interaction with this version of publishFileComment is identical to the interaction with the same method in the public and honeypot API. The only difference is a lack of task spooling, so it has a chance of taking less than 15 seconds to run.

### makePrivateConnection.getDomainReport()
The interaction with this version of getDomainReport is identical to the interaction with the same method in the public and honeypot API. The only difference is a lack of task spooling, so it has a chance of taking less than 15 seconds to run.

### makePrivateConnection.getIP4Report()
The interaction with this function is identical to the interaction with checkIPv4 in the public and honeypot APIs. The only difference is a lack of task spooling, so it has a chance of taking less than 15 seconds to run.

### makePrivateConnection.getUrlComments()
getUrlComments is a private-only feature. This gathers all of the comments on a particular URL that people have made using the API or the web interface. This function takes 3 parameters: a URL "with protocol", a callback function for any valid responses, and a callback function for errors. The response callback will have a single parameter: an object with the data. The error callback will have a single parameter which may be an object or a string.

### makePrivateConnection.getFileComments()
getFileComments is a private-only feature. This gathers all of the comments on a particular file that people have made using the API or the web interface. This function takes 3 parameters: a file identifier, a callback function for any valid responses, and a callback function for errors. The file identifier must be either the SHA1, MD5, or SHA256 hash of the file being looked up. The response callback will have a single parameter: an object with the data. The error callback will have a single parameter which may be an object or a string.

### makePrivateConnection example
```
var con = vt.makePrivateConnection();
con.setKey("e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d");
console.log(con.getKey());
con.getIP4Report("90.156.201.27",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.getDomainReport("wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
```

## Security And Legal Notes
The Virustotal API supports both HTTP and HTTPS. This API only uses HTTPS.

The Virustotal API supports 3 hash algorithms: MD5, SHA1, and SHA256 "A member of the SHA2 family". MD5 is well known to be broken. SHA1 is theorized to have collisions, though none are known. SHA2 is not widely regarded as flawed, but was published by the US NSA, so make what you will of that.

The site mentioned in the example code is a known phishing site. It was shut down, but I still advise against going to it. It is used here because it makes an easy to understand example.

All of this code is under the MIT license, with the possible exception of the modules, which are under their own licenses, which should be readable in their documentation. While this code is under the MIT license, the Virustotal REST API is under a custom license which should be read separately, before attempting to use this API.
