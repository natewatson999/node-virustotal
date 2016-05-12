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

Virustotal is a service provided by Google which provides supplemental malware analysis and address analysis. Go here for more information: https://www.virustotal.com/ . This module simplifies the process of interacting with Virustotal from a Node.js perspective. This API comes with a working public API key, but users should get their own and use that instead.

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
This function takes 3 parameters: an IPv4 address, a function to perform if a result is obtained, and a function to perform if an error is obtained. The two functions both take a single parameter. In the case of the first function, said parameter will always be a response object. In the case of the second parameter, this is an error object which may be an object of some kind.

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
```