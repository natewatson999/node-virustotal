var vt = require("./code.js");
var fs = require("fs");
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
con.retrieveUrlAnalysis("wikionemore.com",function(data){
  console.dir(data);
}, function(err){
  console.error(err);
});

/*Sidenote: That's a real phishing site. It was shut down, but I still advise against going to it.*/
