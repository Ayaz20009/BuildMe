const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');

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
    {title: "Pending jobs"}
    )
});

router.get('/createjob', function(req, res) {
  res.render('homeowner/createjob', 
    {title: "Create a job"}
    )
});

router.get('/completedjobs', function(req, res) {
  res.render('homeowner/completedjobs', 
    {title: "completedjobs"}
    )
});

router.get('/overview', function(req, res) {
  res.render('homeowner/overview', 
    {title: "overview"}
    )
});

router.get('/message', function(req, res) {
  res.render('homeowner/message', 
    {title: "message"}
    )
});

router.get('/profile', function(req, res) {
  res.render('homeowner/profile', 
    {title: "profile"}
    )
});


module.exports = router;