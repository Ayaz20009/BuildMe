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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }).then((contractors) => {
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

router.get('/signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})

});



module.exports = router;