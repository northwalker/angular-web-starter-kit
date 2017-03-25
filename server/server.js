'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var debug = require('debug')('express');

var app = express();
var router = express.Router();

// development
if (process.env.NODE_ENV === 'development') {
  app.use('/client', express.static('client'));
  app.use('/assets/images', express.static('client/assets/images'));
  app.use('/app', express.static('client/app'));
  app.use('/bower_components', express.static('bower_components'));
  app.use('/.tmp', express.static('.tmp'));
  app.get('/', function (req, res) {
    // console.log(path.join(__dirname,'../.tmp/serve/index.html'));
    res.sendFile(path.join(__dirname, '../.tmp/serve/index.html'));
  });
}
if (process.env.NODE_ENV === 'production') {

  app.use('/styles', express.static('dist/styles'));
  app.use('/scripts', express.static('dist/scripts'));
  app.use('/assets/images', express.static('dist/assets/images'));
  app.get('/time', function (req, res) {
    res.json({'time': new Date()});
  });
  app.get('/', function (req, res) {
    // console.log(path.join(__dirname,'../.tmp/serve/index.html'));
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}


// production


app.listen(4000);
