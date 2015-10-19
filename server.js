var path = require('path');
var config = require('./setup-config');
var Express = require('express');
var request = require('request');
var getUrls = require('get-urls');
var simple_timer = require('simple-timer');
var expandUrl = require('expand-url');
var param = require('node-qs-serialization').param;
var app = Express();
var ImageResolver = require('image-resolver');
var remoteServer = config.host;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(Express.static('build'));

var port = process.env.PORT || 8080;

var resolver = new ImageResolver();
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.Webpage());


app.get('/query',function(req, res){
  simple_timer.start('Search Timer', true);
  console.log('Hitting API Server');
  var rply = {};
  var i = 0;
  var j = 0;
  var tUrl = /https?:\/\/twitter\.com\/(#!\/)?[a-zA-Z0-9_]+/;
  request(remoteServer+config.getResults+req.query.q,function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      rply.count = body.count;
      rply.results = [];
      function sendResponse(){
        simple_timer.stop('Search Timer', true);
        rply.totalTime = simple_timer.get('Search Timer').delta;
        console.log("[",rply.totalTime,"]  sending response.......");
        res.json(rply);
      }
      function fetchDetails(){
        console.log('number----------------------',i);
        var temp = {};
        var r = body.results[i];
        var urlArray = getUrls(r.result);
        temp.time = r.myId.time;
        temp.user = r.screenName;
        temp.tweet = r.result.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        temp.urls = urlArray;
        if(r.imageUrl === 'none'){
          function getImgUrl(){
            if(urlArray.length === 0){
              temp.imgUrl = 'none';
              if(i< (body.count - 1)){
                i++;
                rply.results.push(temp);
                fetchDetails();
              } else{
                sendResponse();
              }
            } else
            expandUrl.expand(urlArray[j].toString(),function(err,url){
              console.log(i,'--',j,'--------',url);
              tUrl.test(url) ? temp.imgUrl = 'none' :
              resolver.resolve(urlArray[j].toString(),function(result){
                if(result){
                  temp.imgUrl = result.image;
                  if(j < (urlArray.length - 1)){
                    j++;
                    getImgUrl();
                  } else {
                    if(i< (body.count - 1)){
                      i++;
                      rply.results.push(temp);
                      fetchDetails();
                    } else{
                      sendResponse();
                    }
                  }
                }
                else{
                  temp.imgUrl = 'none';
                  if(i< (body.count - 1)){
                    i++;
                    rply.results.push(temp);
                    fetchDetails();
                  }
                }
              });
            });
          }
          getImgUrl();
        } else {
          temp.imgUrl = r.imageUrl;
          if(i< (body.count - 1)){
            i++;
            rply.results.push(temp);
            fetchDetails();
          } else{
            sendResponse();
          }
        }
      }
      fetchDetails();
    }else{
      console.log('error');
    }
  })
});

app.get('/*' , function(req, res){
  var file = path.join(__dirname, '/build', 'index.html');
  res.sendFile(file);
});


app.listen(port, function () {
  console.log('http://localhost:'+port);
});
