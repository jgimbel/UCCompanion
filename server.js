var express = require("express");
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var multer = require('multer');

var app = express(); //use express.

app.set('dbhost', process.env.IP || 'localhost');
app.set('dbname', 'companion');
mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'));
//set view engine
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
nunjucks.configure('views', { //setting up our templating engine
    autoescape: true,
    express: app,
    watch: true
});

app.set('port', process.env.PORT || 1337); // telling c9 where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');
app.use(express.static('public')); //static folder for things like css
app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));
app.use(multer({
        dest: './tmp/'
    })) //need to figure out exactly what this does.
app.use(cookieParser('Secret secret, I have a secret')); //things to track the user
app.use(session({
    secret: 'its the app UC needs, and the one it deserves.',
    resave: true,
    saveUninitialized: true
}));
var routes = require('./routes/')();
app.use(routes); //setup them routes
var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("UC-companion running on https://%s:%s",
        address.address, address.port);
});