var path = require('path');
var config = require('./setup-config');
var Express = require('express');
var request = require('request');
var param = require('node-qs-serialization').param;
var app = Express();
var remoteServer = config.host+':'+config.port;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(Express.static('build'));

app.get('/query',function(req, res){
  request(remoteServer+config.getResults+req.query.q,function(error, response, body){
    if (!error && response.statusCode == 200) {
      res.send(body)
    }else{
      console.log('error');
    }
  })
});

app.get('/*' , function(req, res){
  var file = path.join(__dirname, '/build', 'index.html');
  res.sendFile(file);
});


app.listen(9090, function () {
  console.log('http://localhost:9090');
});
