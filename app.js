'use strict';

var express = require('express');
var app = express();

app.set('view engine','jade');
app.set('views',__dirname + '/templates');

app.get('/',function(req,res){
  res.render('index')
});

app.get('/signup',function(req,res){
	res.render('signup')
});

app.get('/jobs',function(req,res){
	res.render('jobs')
});

app.get('/dashboard',function(req,res){
	res.render('dashboard')
});

app.get('/howitworks',function(req,res){
	res.render('howitworks')
});

app.get('/searchajob',function(req,res){
	res.render('searchajob')
});

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});
