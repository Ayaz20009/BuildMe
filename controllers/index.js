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
router.use('/homeowner', require('./homeowner'));
router.use('/contractor', require('./contractor'));

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contractor-signup',function(req,res){
    res.render('contractor-signup', {title: 'Contractor Sign Up'});
});

router.post('/contractor-signup',function(req,res,next){
  if(req.body.name &&
    req.body.companyName &&
    req.body.phoneNumber &&
    req.body.licenseNumber &&
    req.body.email &&
    req.body.password){

    models.contractors.create({
    name: req.body.name,
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    licenseNumber: req.body.licenseNumber,
    email: req.body.email,
    password: req.body.password
    }).then((contractors) => {
        res.redirect('/contprofile');
    }).catch(() => {
        res.send('ERROR');
    });

  }else{
    var err = new Error('All fields required');
    err.status = 400;
    return next(err);
  }

});

router.get('/homeowner-signup',function(req,res){
  res.render('homeowner-signup')
});

router.post('/homeowner-signup',function(req,res,next){
  if(req.body.firstName &&
     req.body.lastName &&
     req.body.zipcode &&
     req.body.email &&
     req.body.password){


  models.homeowners.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    zipcode: req.body.zipcode,
    email: req.body.email,
    password: req.body.password,
    }).then((homeowners) => {
        res.redirect('/dashboard');
    }).catch(() => {
        res.send('ERROR');
    });

}else{
  var err = new Error('All fields required');
  err.status = 400;
  return next(err);
}
});

router.get('/jobs', function(req, res) {

  models.homeowner_jobs.findAll()
  .then(function(projects){
    if(projects){
      console.log(projects);
      res.render('jobs', {title: 'Jobs',projects:projects});
    }
       
  });
  
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

router.get('/login', function(req, res) {
  req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
  });
});

router.get('/homeowners-signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})
});

router.get('/contractor-signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})
});

module.exports = router;
