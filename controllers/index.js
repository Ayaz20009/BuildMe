var express = require('express');
var router = express.Router();
var models = require('../models')

router.get('/', function(req, res) {
  res.render('index', {title: 'Build Me'})
});

router.get('/jobs', function(req, res) {
  res.render('jobs', {title: 'Jobs'})
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {title: 'Dashboard'})
});

router.get('/howitworks', function(req, res) {
  res.render('HowitWorks', {title: 'How it Works'})
});

router.get('/searchajob', function(req, res) {
  res.render('searchajob', {title: 'Search A job'})
});

router.get('/signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})

});

router.post('/signup',function(req,res){
	console.log(req.body);
	models.contractors.create({
		first_name: req.body.firstName,
 		last_name: req.body.lastName,
 		address: req.body.address,
 		phone_number: req.body.phone,
 		email: req.body.email
	}).then(function (profile){
		res.redirect('./profile')
	}).catch(function(e){
		res.send('Error');
	})
});


module.exports = router;