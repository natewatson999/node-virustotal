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

Virustotal is a service provided by Google which provides supplemental malware analysis and address analysis. Go here for more information: https://www.virustotal.com/ . This module simplifies the process of interacting with Virustotal from a Node.js perspective. This API comes with a working API key, but users should get their own and use that instead. It also uses the default key for the honeypot API. This must be changed.

This API provides factory methods which make connection objects, which act as job queues. There are 4 kinds of connections: with the public API, public API with honeypot permissions, private API, and email API.

If you would like to subsidize the development of this module, please consider donating on patreon: https://www.patreon.com/user?u=3336787&ty=h

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
getFileReport() asks Virustotal for the report of a file that was previously submitted. It takes 3 parameters. The first parameter is the file's scan_id , which is obtained as a member variable in the result of submitFileForAnalysis. The next two parameters are the usual response and error functions. By default, if Virustotal reports that the file in question hasn't been scanned yet, then this function will continue to request reports until one is obtained or an error happens. This requesting process happens within the bounds of the job queueing system that the rest of this API uses. However, depending on Virustotal's load, this can take hours, so whatever you do, don't use this for real time responses.

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
con.getFileReport("52d3df0ed60c46f336c131bf2ca454f73bafdc4b04dfa2aea80746f5ba9e6d1c-1273894724", function(data){
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
getFileReport() asks Virustotal for the report of a file that was previously submitted. It takes 3 parameters. The first parameter is the file's scan_id , which is obtained as a member variable in the result of submitFileForAnalysis. The next two parameters are the usual response and error functions. By default, if Virustotal reports that the file in question hasn't been scanned yet, then this function will continue to request reports until one is obtained or an error happens. This requesting process happens within the bounds of the job queueing system that the rest of this API uses. However, depending on Virustotal's load, this can take hours, so whatever you do, don't use this for real time responses.

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
con.getFileReport("52d3df0ed60c46f336c131bf2ca454f73bafdc4b04dfa2aea80746f5ba9e6d1c-1273894724", function(data){
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

### makePrivateConnection.submitFileForAnalysis()
This is similar to makePublicConnection.submitFileForAnalysis(). The difference is that this one has a larger size limit of 200 megabytes instead of the standard 32 megabytes, and there's no job queueing.

### makePrivateConnection.submitUrlForScanning()
This is identical to makePublicConnection.submitUrlForScanning(), except without the task spooling.

### makePrivateConnection.retrieveUrlAnalysis()
This version is very different from its counterpart in the public and honeypot API. What it's actually used for is identical though. This version has 5 or 6 parameters. The first parameter is the URL that a report is wanted on. The second and third parameters are the usual response and error callback functions with the usual parameters. The next one is a boolean variable which indicates if the script should request that Virustotal rescan the URL. The next boolean variable is if you want the extended data, with false giving the same output you'd get with public and honeypot mode; and true giving extra sandbox information. The final parameter is optional. If the final parameter is not specified; then if Virustotal doesn't have results for the URL yet, then the function will keep retrying every 5 minutes until it gets results. If the function is specified; then if Virustotal hasn't scanned the URL yet, then the function will be fired with the response body as the only parameter.

### makePrivateConnection.getFileReport
This contacts Virustotal and attempts to get the report of a specified file. It takes 4 or 5 parameters. The first parameter is the file's scanID. This is obtained in the same way as in the public and honeypot APIs. The second and third parameters are the response and error callback functions, which have the usual parameters. The 4th parameter is a boolean value, which tells Virustotal to provide the extended data if true, and the regular data if false. The next parameter is optional. It is a callback function to perform if Virustotal hasn't analyzed the file yet. The only parameter is the body of the HTTPS response. If this function isn't specified, then the API will keep trying every 5 minutes until it gets a report or gives an error.

### makePrivateConnection.getFile
This function is extremely dangerous. Do not use this on any mission critical system, any system with medical data, any system with personal or authentication related information, any system with financial information, or any system which could result in a person's harm or death if compromised. It is recommended that this function not be used, since it downloads malware. getFile downloads a piece of suspected malware from Virustotal. It takes 3 parameters: a hashcode and two callback functions. The hashcode is an MD5, SHA1, or SHA256 identifier of the file being requested. MD5 and SHA1 are heavily discouraged for this due to real and suspected collisions. SHA256 is discouraged for security reasons. The other two parameters are the response and error callback functions.

### makePrivateConnection.rescan
This function is extremely different from its counterpart in the public and honeypot APIs. It takes a signature of either MD5, SHA1, or SHA256; and returns a rescan object. The rescan object contains several configuration methods, an execution method, and a cancel method. Like its counterparts, this is used to ask Virustotal to rescan a file.

#### makePrivateConnection.rescan.sendRequest
This function is the function that actually sends the rescan request to Virustotal. It takes two parameters, both of which are callback functions. One is for a response, the other for an error. The usual rules apply with these.

#### makePrivateConnection.rescan.cancel
This function cancels a rescan request that was previously sent to Virustotal. This function has the exact same parameters as sendRequest.

#### makePrivateConnection.rescan.setDate
This function schedules a rescan for an arbitrary point in time, rather than the default behavior of "Whenever Virustotal has the server capacity to perform the scan". It takes 6 parameters: a 4 digit year, a 2 digit month, a 2 digit day, a 2 digit hour "in European format", a 2 digit minute, and a 2 digit second variables.

#### makePrivateConnection.rescan.setPeriod
This function basically states "after the first rescan, keep running this every X number of days" where X is the only parameter of the function.

#### makePrivateConnection.rescan.setRepeatCount
This function basically states "rescan this file X number of times, using the time between scans specified in setPeriod()", where X is the only parameter. If this isn't used, and setPeriod is used, the rescans will continue forever.

#### makePrivateConnection.rescan.setNotifyURL
This function basically states "Virustotal, when you're done scanning this file, POST the results to X URL", where X is a fully qualified domain name, and the only parameter.

#### makePrivateConnection.rescan.setNotifyChangesOnly
This function basically states "Virustotal, remember that URL I sent you using setNotifyURL? if X is 1, only send the results if you find something you didn't find in previous scans. If X is 0, send the results no matter how inconsequential they are.", where X is the only parameter, and can be a 0 or 1.   

### makePrivateConnection.getFileBehavior
This function asks Virustotal for a behavior report for a particular file. There are 3 parameters. The first one is either an MD5, SHA1, or SHA256; with SHA256 being the least non-preferred one. The other two parameters are the usual response and error callbacks with the usual parameters. The response might not have a response_code.

### makePrivateConnection.getFileNetworkActivity
This function asks Virustotal for a network activity report for a particular file. There are 3 parameters. The first one is either an MD5, SHA1, or SHA256; with SHA256 being the least non-preferred one. The other two parameters are the usual response and error callbacks with the usual parameters. The response might not have a response_code.

### makePrivateConnection.getClusters
This function asks Virustotal for a cluster analysis of the files submitted for a particular date. There are 5 parameters. The first 3 are a year, month, and date; in 4 digit, 2 digit, and 2 digit numbers respectively. The last two are the usual response and error callbacks with the usual parameters. The cluster list may be of length 0 or greater.

### makePrivateConnection.getFileFeed
This function asks Virustotal for an array of all of the analysis information of files submitted in a particular minute. It takes 7 parameters. The first 5 are year, month, date, hour, and minute being requested, in 4 digits, 2 digits, 2 digits, 2 digits, and 2 digits respectively. Virustotal only keeps records for 24 hours, so this should probably be used in tandem with Cron. The other two parameters are the usual response and error callbacks. The response's only parameter is an array of objects. The error is either a string or an object, probably a string.

### makePrivateConnection.getUrlFeed
This function asks Virustotal for an array of all of the analysis information of URLs submitted in a particular minute. It takes 7 parameters. The first 5 are year, month, date, hour, and minute being requested, in 4 digits, 2 digits, 2 digits, 2 digits, and 2 digits respectively. Virustotal only keeps records for 24 hours, so this should probably be used in tandem with Cron. The other two parameters are the usual response and error callbacks. The response's only parameter is an array of objects. The error is either a string or an object, probably a string.

### makePrivateConnection.getNextFalsePositive
This asks Virustotal for the next false positive in the queue of false positives. The Virustotal documentation does a better job explaining what the false positives are for, than I can explain it: https://www.virustotal.com/en/documentation/private-api/#file-false-positives . This asks Virustotal with a limit of 1. It takes 2 parameters: The usual response and error callbacks. The error's only parameter will be a string or object of some kind. The response's parameter will be a false positive Object, or an empty object, depending on if there was anything in the queue. The second one is unlikely, but should still be accounted for.

### makePrivateConnection.search
This searches the Virustotal database based on signature information. It takes 3 parameters: a query object, a response callback, and an error callback.

The error callback's only parameter is an error which is either a string or an object. the response callback's only parameter is an Object whose members are response_code, offset, and hashes. response_code will be a 1 or 0, depending on if there were any results. hashes is an array of SHA256 signatures of files that meet the search query. offset is the most complex one. Search only returns the results in blocks of 300 or less. So if there's more than 300 valid results, another query is needed. In this API, the secondary query can be performed by using search again, but with the query object including the member variable 'offset', with the offset as its value. This will return another block of 300 or less. If there's less than 300 results remaining for a query, the offset will be an empty string.

The query object can have the following member variables. It must have at least one valid member variable that is not offset. Virustotal supports many more parameters, but these are the only ones supported by the API at this time. They will be updated.

* type : this one is the file type, in the form of file extension such as 'exe' or 'pdf'.
* name : this is the file's known name in the wild.
* offset : this specifies offset, as defined in the second paragraph of the search documentation.
* lowerSize : this asks Virustotal "only give results whose filesize is at least this size in kilobytes". Must be an integer.
* upperSize : this asks Virustotal "only give results whose filesize is at most this size in kilobytes". Must be an integer.
* tag : this reduces the results to only files which have been tagged with certain characteristics. https://www.virustotal.com/intelligence/help/file-search/#search-modifiers includes a list of valid tags.
* firstSubmittedBefore : A Date object which specifies that the file was first submitted before a certain point in time.
* firstSubmittedAfter : A Date object which specifies that the file was first submitted after a certain point in time.
* lastSubmittedBefore : A Date object which specifies that the file was last submitted before a certain point in time.
* lastSubmittedAfter : A Date object which specifies that the file was last submitted after a certain point in time.
* AtLeastPositives : An integer which asks Virustotal to only return files which have at least this many malware services flagging this as malware.
* AtMostPositives : An integer which asks Virustotal to only return files which have at most this many malware services flagging this as malware.
* AtLeastChildPositives : An integer which asks Virustotal to ony return files which have at least this many malware services flagging the sub-files as malware. Sub-files are things like files in tarballs, files in ISO files, and JAR files.
* AtMostChildPositives : An integer which asks Virustotal to ony return files which have at most this many malware services flagging the sub-files as malware. Sub-files are things like files in tarballs, files in ISO files, and JAR files.

### makePrivateConnection example
```
var con = vt.makePrivateConnection();
con.setKey("e2513a75f92a4169e8a47b4ab1df757f83ae45008b4a8a49903450c8402add4d");
console.log(con.getKey());

var searchQuery ={
  type:"svg",
  name:"obviousVirus.svg"
};
var searchProc = function(){
  con.search(searchQuery, function(results){
    for (var index = 0; index < results.hashes.length; index++) {
      console.log(results.hashes[index]);
    }
    if (results.offset != "") {
      searchQuery.offset = results.offset;
      searchProc();
    }
    return;
  },function(error){
    console.log(error);
    return;
  });
};
searchProc();

con.getFileComments("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(data){
  var comments = data.comments;
  if (comments.length > 0) {
    for (var index = 0; index < comments.length; index++) {
      console.log(comments[index].date);
      console.log(comments[index].comment);
    }
  }
}, function(err){
  console.error(err);
});
con.getUrlComments("http://wikionemore.com",function(data){
  var comments = data.comments;
  if (comments.length > 0) {
    for (var index = 0; index < comments.length; index++) {
      console.log(comments[index].date);
      console.log(comments[index].comment);
    }
  }
}, function(err){
  console.error(err);
});
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
con.submitFileForAnalysis("obvious_virus.svg", "text/svg", fs.readFileSync("./obvious_virus.svg"), function(data){
  console.log(data);
}, function(mistake){
  console.log(mistake);
});
con.publishUrlComment("http://wikionemore.com", "Ignore this comment. I'm just testing an API.", function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});
con.publishFileComment("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", "Ignore this comment. I'm just testing an API.", function(data){
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
}, false, true, function(stillWaiting){
  console.log(stillWaiting);
});
con.getFileReport("52d3df0ed60c46f336c131bf2ca454f73bafdc4b04dfa2aea80746f5ba9e6d1c-1273894724",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
}, true, function(waitingMessage){
  console.log(waitingMessage);
});
con.getFile("52d3df0ed60c46f336c131bf2ca454f73bafdc4b04dfa2aea80746f5ba9e6d1c", function(malware){
    SendToEvilPeople(malware,"crosswindsyouth.org");
}, function(error){
    console.log(error);
});
con.getFileBehavior("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(response) {
  console.dir(respose);
}, function(error){
  console.log(error);
});
con.getFileNetworkActivity("de053e0e115fc94a81eb3dc074b02c68efaa60ff4251f386e299d8814ff657a6", function(response) {
  console.dir(respose);
}, function(error){
  console.log(error);
});
con.getClusters(2015,12,31,function(response) {
  console.dir(respose);
}, function(error){
  console.log(error);
});
con.getUrlFeed(2016,12,31,23,59,function(responses){
    for (var index = 0; index < responses.length; index++) {
      console.dir(responses[index]);
    }
}, function(error){
    console.log(error);
});
con.getFileFeed(2016,12,31,23,59,function(responses){
    for (var index = 0; index < responses.length; index++) {
      console.dir(responses[index]);
    }
}, function(error){
    console.log(error);
});
con.getNextFalsePositive(function(response){
  console.dir(response);
},function(error){
  console.log(error);
});
var rescanJob = con.makeRescan("52d3df0ed60c46f336c131bf2ca454f73bafdc4b04dfa2aea80746f5ba9e6d1c");
rescanJob.setPeriod(1).setRepeatCount(1).setDate(2016,12,31,23,59,59).setNotifyURL("https://www.google.com:3073").setNotifyChangesOnly(0);
rescanJob.sendRequest(function(response){
  console.dir(response);
}, function(err){
  console.error(err);
});
rescanJob.cancel(function(response){
  console.dir(response);
}, function(err){
  console.error(err);
})
```

## makeEmailConnection
This returns an EmailConnection object. Unlike the other APIs, which all use REST services, this uses Virustotal's email service. It's also event-driven rather than callback-driven. This is because of dependencies. It takes one parameter: a configuration object. The configuration object must have 3 member variables:
* SMTP: this is SMTP connection data, as outlined in the documentation for emailjs: https://github.com/eleith/emailjs
* sender: this is a string with the email address the files shall be sent from.
* IMAP: this is the IMAP connection data, as outlined in the documentation for mail-notifier: https://www.npmjs.com/package/mail-notifier

### makeEmailConnection.submitFileForAnalysis
This emails Virustotal with a potentially malicious file. It takes 3 parameters: the file's content, filename as found in the wild, and mime type. It will result in the "error" or "sent" emissions.

### makeEmailConnection.startCheckingForResponses
This starts querying the email server for responses from Virustotal. Whenever a response is received, an analysis event is fired.

### makeEmailConnection.stopCheckingForResponses
This stops the querying to the email provider for responses. Note: Unless this is used, the script won't end by natural means. It will still end in the event of a system failure, node failure, unhandled exception, or use of CTRL-C.

### makeEmailConnection.on
#### makeEmailConnection.on("error")
This is a generic error emission. The only parameter of the callback function is either a string or an error object.

#### makeEmailConnection.on("sent")
This is fired when a file is sent to Virustotal. The only parameter is the message object of the transmission.

#### makeEmailConnection.on("analysis")
This is fired when an analysis of a file is recieved. The only parameter is an analysis object. The analysis object has the following member variables:
* verbose: it's the verbose message sent by Virustotal.
* filename: the filename
* size: the filesize in kilobytes
* MD5: the file's MD5 signature.
* SHA1: the file's SHA1 signature.
* scans: an array of all of the scan jobs:
* scans[index].scanner: the program which scanned the file
* scans[index].versionTimestamp: contains the program's versioncode and date of scan. These don't have a unified version system.
* scans[index].verbose: contains the verbose output of the scan operation


### makeEmailConnection example
```
var virustotal = require("node-virustotal");
var fs = require("fs");
var workingEmail = virustotal.makeEmailConnection({
	IMAP: {
		username: 'yourEmailHere',
		password: 'yourPasswordHere',
		host: 'imap.gmail.com',
		port: 993,
		tls: true,
		mailbox: "Inbox" /*may change for other providers, but is usually Inbox*/
	},
	SMTP: {
		user: 'yourEmailHere',
		password: 'yourPasswordHere',
		host: "smtp.gmail.com",
		ssl: true
	},
	sender: "jainri.developer@gmail.com"
});
workingEmail.on("error", function(e){
	console.log(e);
});
workingEmail.on("analysis", function(analysis){
	console.dir(analysis);
  workingEmail.stopCheckingForResponses();
});
workingEmail.startCheckingForResponses();
workingEmail.submitFileForAnalysis(fs.readFileSync("./obvious_virus.svg"), "obvious_virus.svg", "text/svg");
```

## Security And Legal Notes
The Virustotal API supports both HTTP and HTTPS. This API only uses HTTPS.

The Virustotal API supports 3 hash algorithms: MD5, SHA1, and SHA256 "A member of the SHA2 family". MD5 is well known to be broken. SHA1 is theorized to have collisions, though none are known. SHA2 is not widely regarded as flawed, but was published by the US NSA, so make what you will of that.

The site mentioned in the example code is a known phishing site. It was shut down, but I still advise against going to it. It is used here because it makes an easy to understand example.

All of this code is under the MIT license, with the possible exception of the modules, which are under their own licenses, which should be readable in their documentation. While this code is under the MIT license, the Virustotal REST API is under a custom license which should be read separately, before attempting to use this API.
