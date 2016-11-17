const express = require('express');
//const fs = require('fs');
const path = require('path');
const models = require('../models');
const router = express.Router();
//const basename = path.basename(module.filename);

// fs
//   .readdirSync(__dirname)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach(file => {
//     const fileName = file.substr(0, file.length - 3);
//     router.use(`/${fileName}`, require(`./${fileName}`).registerRouter());
//   });

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contractor-signup',function(req,res){
    res.render('contractor-signup');
});

router.post('/contractor-signup',function(req,res){
    models.contractors.create({
      name: req.body.name,
      companyName: req.body.companyName,
      phoneNumber: req.body.phoneNumber,
      licenseNumber: req.body.licenseNumber,
      email: req.body.email,
      password: req.body.password,
    }).then((contractors) => {
        res.redirect('/');
    }).catch(() => {
        res.send('ERROR');
    });
//Validation
// req.checkBody('firstName', 'First Name is required').notEmpty();
// req.checkBody('lastName', 'First Name is required').notEmpty();
// req.checkBody('username', 'Username is required').notEmpty();
// req.checkBody('email','Email is required').notEmpty();
// req.checkBody('email','Email is not valid').isEmail();
// req.checkBody('password','Password is required').notEmpty();

// var errors = req.validationErrors();
// if (errors){
//   res.render('signup',{
//     errors:errors
//   });
// }
// else{
//   console.log('Passed');
// }
});

router.get('/homeowner-signup',function(req,res){
  res.render('homeowner-signup')
});

router.post('/homeowner-signup',function(req,res){
    models.homeowners.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      zipcode: req.body.zipcode,
      email: req.body.email,
      password: req.body.password,
    }).then((homeowners) => {
        res.redirect('/');
    }).catch(() => {
        res.send('ERROR');
    });
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

router.get('/login', function(req, res) {
  res.render('login', {title: 'Login'})
});

router.get('/homeowners-signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})
});

router.get('/contractor-signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})
});



module.exports = router;
