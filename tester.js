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

/*Sidenote: That's a real phishing site. It was shut down, but I still advise against going to it.*/
