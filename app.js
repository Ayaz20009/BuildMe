'use strict';

const express = require('express');
const app = express();

app.set('view engine','jade');
app.set('views',__dirname + '/views');

app.use(require('./controllers'));

// var index = require('./controllers/index');
// app.use('/', index)


// app.get('/signup',function(req,res){
// 	res.render('signup')
// });

// app.get('/jobs',function(req,res){
// 	res.render('jobs')
// });

// app.get('/dashboard',function(req,res){
// 	res.render('dashboard')
// });

// app.get('/howitworks',function(req,res){
// 	res.render('HowitWorks')
// });

// app.get('/searchajob',function(req,res){
// 	res.render('searchajob')
// });

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});
