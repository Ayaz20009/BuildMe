const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');
var session;

router.route('/homeowner')

router.get('/dashboard', function(req, res) {
  res.render('homeowner/dashboard', 
    {title: "homeowner's dashboard"}
    )
});

router.post('/dashboard', function(req, res) {
  var email = req.body.home_email;
  var pass = req.body.home_pass;
  console.log(email)
  models.homeowners.findOne({
      where: {
         email: email,
         // password:pass,
     }
  }).then(function(user){

      if(user){
          session = user.dataValues;
          console.log(user);
          res.render('homeowner/dashboard', {title: user.dataValues.firstName, user: user.dataValues})
      }
      else{
          // req.session.valid = false;
          return res.redirect('/login');
      }

  });
});

router.get('/pendingjobs', function(req, res) {
  res.render('homeowner/pendingjobs', 
    {title: "Pending jobs", user: session}
    )
});

router.get('/createjob', function(req, res) {
  res.render('homeowner/createjob', 
    {title: "Create a job", user: session}
    )
});

router.get('/completedjobs', function(req, res) {
  res.render('homeowner/completedjobs', 
    {title: "completedjobs", user: session}
    )
});

router.get('/overview', function(req, res) {
  res.render('homeowner/overview', 
    {title: "overview",user: session}
    )
});

router.get('/message', function(req, res) {
  res.render('homeowner/message', 
    {title: "message", user: session}
    )
});

router.get('/profile', function(req, res) {
  res.render('homeowner/profile', 
    {title: "profile", user: session}
    )
});


module.exports = router;