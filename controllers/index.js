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

router.get('/signup',function(req,res){
    res.render('signup');
});

router.post('/signup',function(req,res){
    models.contractors.create({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      address: req.body.address,
      phone_number: req.body.phone,
      email: req.body.email,
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



module.exports = router;