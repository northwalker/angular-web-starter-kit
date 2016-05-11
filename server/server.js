'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var debug = require('debug')('express');

var app = express();
var router = express.Router();


// development
app.use('/client', express.static('client'));
app.use('/assets/images', express.static('client/assets/images'));
app.use('/app', express.static('client/app'));
app.use('/bower_components', express.static('bower_components'));
app.use('/.tmp', express.static('.tmp'));

app.get('/', function(req, res) {
  // res.sendfile('./client/index.html');
  res.sendfile('./.tmp/serve/index.html');
  // res.json({"time":new Date()})
});



// production



app.listen(4000);
