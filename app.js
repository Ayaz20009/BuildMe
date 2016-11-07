'use strict';
const bodyParser = require('body-parser');
const pug = require('pug');
const express = require('express');
const models = require('./models/');
const Sequelize = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

var sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
var sql = new Sequelize('buildme_development', 'pg_user', 'pg_pass', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});
var test = sql.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log("SOMETHING DONE GOOFED");
    })
    .done();

app.set('view engine','pug');
app.set('views', `${__dirname}/views/`);

app.use(require('./controllers/'));
// app.get('/',function(req,res){
//     res.render()
// })

// app.use('./controllers/signup');
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});

