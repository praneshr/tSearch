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


var MetaInspector = require('node-metainspector');
var client = new MetaInspector("https://t.co/3jXbhBV4R2", {});
app.get('/query',function(req, res){
  simple_timer.start('Search Timer', true);
  console.log('Hitting API Server');
  var rply = {};
  var tUrl = /https?:\/\/twitter\.com\/(#!\/)?[a-zA-Z0-9_]+/;
  rply.query = req.query.q;
  rply.results = []
  var preprocess = await('preprocess');
  var resolveUrls = await('resolveUrls');
  var resolveImages = await('resolveImages');
  var imageStart = await('imageStart');
  var longUrlArray = [];
  request(remoteServer+config.getResults+req.query.q+config.auth,function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      var resultCount = body.results.length;
      rply.count = resultCount;
      function preprocess(i){
        if(i === resultCount){
          return res.send(rply);
        }
        var temp ={};
        var obj = body.results[i];
        temp.tweet = obj.result.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        temp.time = obj.myId.time;
        var urls = getUrls(obj.result);
        var urlsLength = urls.length;
        if(urls.length === 0){
          temp.links = 'none';
          console.log('no-link');
          imageStart.keep('imageStart');
        } else {
          function resolveUrl(i){
            var link = urls[i]
            expandUrl.expand(link, function(err, longUrl){
              console.log(i,urlsLength);
              if(!tUrl.test(longUrl))
                longUrlArray.push(longUrl);
              if((i+1)>= urlsLength){
                resolveUrls.keep('resolveUrls');
              } else {
                if(i< urls.length)
                  resolveUrl(i+1);
              }
            });
          }
          resolveUrl(0)
        }
        resolveUrls.onkeep(function(got){
          console.log(longUrlArray);
          temp.links = longUrlArray;
          imageStart.keep('imageStart');
        });
        imageStart.onkeep(function(){
          console.log('starting img');
          if(obj.imageUrl !== 'none' || longUrlArray.length === 0){
            temp.imgUrl = obj.imageUrl;
            resolveImages.keep('resolveImages');
          } else {
            resolver.resolve((longUrlArray[0]).toString(),function(result){
              if(result){
                temp.imgUrl = result.image;
                resolveImages.keep('resolveImages');
              } else {
                temp.imgUrl = 'none';
                resolveImages.keep('resolveImages');
              }
            });
          }
        })
        resolveImages.onkeep(function(){
          rply.results.push(temp);
          preprocess(i+1);
        })
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
