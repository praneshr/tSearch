var path = require('path');
var await = require('await');
var config = require('./setup-config');
var Express = require('express');
var request = require('request');
var getUrls = require('get-urls');
var simple_timer = require('simple-timer');
var expandUrl = require('expand-url');
var param = require('node-qs-serialization').param;
var app = Express();
var ImageResolver = require('image-resolver');
var resolver = new ImageResolver();
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.Webpage());
var remoteServer = config.host;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(Express.static('build'));

var port = process.env.PORT || 8080;

app.get('/query',function(req, res){
  simple_timer.start('Search Timer', true);
  console.log('Hitting API Server');
  var rply = {};
  var tUrl = /https?:\/\/twitter\.com\/(#!\/)?[a-zA-Z0-9_]+/;
  rply.query = req.query.q;
  rply.page = req.query.page
  rply.results = [];
  //request(remoteServer+config.getResults+req.query.q+config.auth+config.page+req.query.page,function(error, response, body){
    request(remoteServer+config.getResults+req.query.q + "/" + req.query.page ,function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body)
      rply.pageCount = body.pageCount;
      //var resultCount = body.results.length;
      var resultCount = body.results.length;
      rply.count = body.count;
     // rply.relatedTags = body.relatedTags;
      function preprocess(i){
        if(i === resultCount){
          return res.send(rply);
        }
        var temp ={};
        var obj = body.results[i];
        //temp.tweet = obj.result.replace(/(?:https?|ftp?|http):\/\/[\n\S]+/g, '');
        temp.time = obj.createdAt;
        temp.imgUrl = obj.image;
        temp.sourceUrl = obj.newsUrl
        temp.title = obj.title
        //var urls = getUrls(obj.result);
        //temp.urls = urls;
        //temp.urls = "" 
        rply.results.push(temp)
        if(i<resultCount){
          preprocess(i+1)
        }
      }
      preprocess(0);
    }
  });
});

app.get('/*' , function(req, res){
  var file = path.join(__dirname, '/build', 'index.html');
  res.sendFile(file);
});


app.listen(port, function () {
  console.log('http://localhost:'+port);
});
