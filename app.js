'use strict';


var Sequelize = require("sequelize");

// var sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");

// var sql = new Sequelize('buildme_development', 'pg_user', 'pg_pass', {

var sql = new Sequelize('buildme_development', 'postgres', '', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

// var test = sql.authenticate()
//     .then(function () {
//         console.log("Connection has been established successfully.");
//     })
//     .catch(function (err) {
//         console.log("Unable to connect to the database:" + err);
//     })
//     .done();

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine','jade');
app.set('views',__dirname + '/views');

app.use(require('./controllers'));
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")

  //db connection
  sql.authenticate()
    .then(function () {
        console.log("Connection has been established successfully.");
    })
    .catch(function (err) {
        console.log("Unable to connect to the database:" + err);
    })
    .done();
});





// var app = express();

// app.engine('handlebars', exphbs({
//   layoutsDir: './views/layouts',
//   defaultLayour: 'main',

// }));