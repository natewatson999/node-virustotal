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
