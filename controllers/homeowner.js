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
  models.homeowners.findOne({
      where: {
         email: email,
         // password:pass,
     },
  }).then(function(user){

      if(user){
          session = user.dataValues;
          res.render('homeowner/dashboard', {title: user.dataValues.firstName, user: user.dataValues})
      }
      else{
          // req.session.valid = false;
          return res.redirect('/login');
      }

  });
});

router.get('/pendingjobs', function(req, res) {

  //find projects that were created by this user
  models.homeowner_jobs.findAll({
      where: {
         hoID: session.id,
     },
     order: '"createdAt" DESC',
  }).then(function(projects){

      if(projects){
          console.log(projects);
          res.render('homeowner/pendingjobs', 
          {title: "Pending jobs", user: session, projects: projects})
      }
      else{

      }

  });

});

router.post('/createjob', function(req, res) {
  var hoID = session.id;
  var desc = req.body.proj_desc;
  var street = req.body.proj_street;
  var city = req.body.proj_city;
  var state = req.body.proj_state;
  var zipcode = req.body.proj_zip;

  if(hoID && desc && street && city && state){

    models.homeowner_jobs.create({
       hoID: hoID,
       jobDesc: desc,
       street: street,
       city: city,
       state: state,
       zipcode: zipcode, 

    }).then(function(project){

      if(project){
          return res.redirect('/homeowner/pendingjobs');
      }
      else
        res.render('homeowner/createjob',{title: "Error", user: session}) 
    });
  }
  else
    res.render('homeowner/createjob',{title: "Error", user: session}) 
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

router.post('/profile', function(req, res) {

  var firstName = req.body.ho_Fname;
  var lastName = req.body.ho_Lname;
  var email = req.body.ho_email;
  var zipcode = req.body.ho_zip;
  var pass = req.body.ho_pass;

  models.homeowners.findOne({
      where: {
         id: session.id,
     }
  }).then(function(user){
      if(user){
          user.updateAttributes({
            firstName :firstName,
            lastName : lastName,
            email : email,
            zipcode : zipcode,
            // pass : pass,
          })
          .then(function(user){
            session = user.dataValues;
            res.render('homeowner/profile', {title: "profile", user: session})
          });
      }
    });
});


module.exports = router;