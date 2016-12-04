'use strict';
const pug = require('pug');
const express = require('express');
const models = require('./models/');
const session = require('express-session');
const Sequelize = require("sequelize");
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

//Making connection with the Database
var sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
var sql = new Sequelize('buildme_development', 'pg_user', 'pg_pass', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
// const client = new pg.Client(connectionString);
// client.connect();

//Testing the database connection
var test = sql.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log("SOMETHING DONE GOOFED");
    })
    .done();
    
// Use session for tracking logins
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false
}));

app.set('view engine','pug');
app.set('views', `${__dirname}/views/`);
app.locals.basedir = app.get('views');
app.use(require('./controllers/'));

//Catch 404 and forward to error handler
app.use(function(req,res,next){
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
// app.get('/',function(req,res){
//     res.render()
// })

// app.use('./controllers/signup');
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});

module.exports = app;