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

<<<<<<< HEAD
// var sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");

// var sql = new Sequelize('buildme_development', 'pg_user', 'pg_pass', {

var sql = new Sequelize('buildme_development', 'postgres', '', {
=======
var sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
var sql = new Sequelize('buildme_development', 'pg_user', 'pg_pass', {
>>>>>>> 9bf3d8b1134fd36fb16011f25b133e233913cfff
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});
<<<<<<< HEAD

// var test = sql.authenticate()
//     .then(function () {
//         console.log("Connection has been established successfully.");
//     })
//     .catch(function (err) {
//         console.log("Unable to connect to the database:" + err);
//     })
//     .done();
=======
var test = sql.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log("SOMETHING DONE GOOFED");
    })
    .done();
>>>>>>> 9bf3d8b1134fd36fb16011f25b133e233913cfff

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

<<<<<<< HEAD

app.post('/signup', function(req,res){

   res.render('/', {title: "Build Me", Fname: "", Lname:"" })

})


// var app = express();

// app.engine('handlebars', exphbs({
//   layoutsDir: './views/layouts',
//   defaultLayour: 'main',

// }));
=======
>>>>>>> 9bf3d8b1134fd36fb16011f25b133e233913cfff
