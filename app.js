var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('push-doorbell:app');
var request = require('request');
var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');
var firebaseProjectConfig =
    require('./public/javascripts/firebase-project-config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseProjectConfig.databaseURL
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var tokens = []
app.post('/add_token', function(req, res) {
    var token = req.body.token;
    if (tokens.indexOf(token) == -1) {
        tokens.push(token);
    }
});
app.post('/remove_token', function(req, res) {
    var token = req.body.token;
    var index = tokens.indexOf(token);
    if (index != -1) {
        tokens.splice(index, 1);
    }
});
app.get('/list_tokens', function(req, res) {
    var str = ''
    for (var i = 0; i < tokens.length; i++) {
        str += tokens[i] + '\n';
    }

    res.send(str);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
