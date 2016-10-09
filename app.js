'use strict';

var express = require('express');
var app = express();

app.get('/',function(req,res){
  res.send("<h1>This is the Homepage</h1>");
});

app.get('/signup',function(req,res){
	res.send("<h1>Sign up page</h1>");
});

app.get('/jobs',function(req,res){
	res.send("<h1>Jobs page</h1>");
});

app.get('/dashboard',function(req,res){
	res.send("<h1>dashboard page </h1>");
});

app.get('/howitworks',function(req,res){
	res.send("<h1>howitworks page</h1>");
});

app.get('/searchajob',function(req,res){
	res.send("<h1>Search a job page</h1>");
});

app.listen(3000,function(){
  console.log("The frontend server is running on port 3000")
});
