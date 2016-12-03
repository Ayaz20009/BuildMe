const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');


router.route('/contractor')

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
        console.log(user);
          req.session.user = "homeowner";
          req.session.firstName = user.dataValues.firstName;
          req.session.lastName = user.dataValues.lastName;
          req.session.userid = user.dataValues.id;
          res.render('homeowner/dashboard', {title: user.dataValues.firstName, session: req.session})
      }
      else
          return res.redirect('/login');
  });

});

router.get('/dashboard', function(req, res) {
  if(!req.session.user)
    return res.status(401).send();
  return res.render('homeowner/dashboard', {title: "homeowner's dashboard",session: req.session})
});


router.get('/pendingjobs', function(req, res) {

  //find projects that were created by this user
  models.homeowner_jobs.findAll({
      where: {
         hoID: req.session.userid,
     },
     order: '"createdAt" DESC',
  }).then(function(projects){

      if(projects){
          // console.log(projects);
          res.render('homeowner/pendingjobs', 
          {title: "Pending jobs", session: req.session, projects: projects})
      }
      else{

      }

  });

});


router.delete('/pendingjobs',function(req,res){

  console.log(req.body.proj_id);
  models.homeowner_jobs.findByID(req.body.proj_id).on('success', function(project) {

     project.destroy().on('success', function(u) {
      if (u && u.deletedAt) {
      // successfully deleted the project
       return res.redirect('/homeonwer/pendingjobs');
    }
  })
})

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
        res.render('homeowner/createjob',{title: "Error", session: req.session}) 
    });
  }
  else
    res.render('homeowner/createjob',{title: "Error", session: req.session}) 
});

router.get('/createjob', function(req, res) {
  res.render('homeowner/createjob', 
    {title: "Create a job", session: req.session}
    )
});

router.get('/completedjobs', function(req, res) {
  res.render('homeowner/completedjobs', 
    {title: "completedjobs", session: req.session}
    )
});

router.get('/overview', function(req, res) {
  res.render('homeowner/overview', 
    {title: "overview",session: req.session})
});

router.get('/message', function(req, res) {
  res.render('homeowner/message', 
    {title: "message", session: req.session}
    )
});

router.get('/profile', function(req, res) {

  models.homeowners.findOne({
      where: {
         id: req.session.userid,
     }
  }).then(function(user){
    
    res.render('homeowner/profile', {title:"profile", user:user, session:req.session});
  });

});

router.post('/profile', function(req, res) {

  var firstName = req.body.ho_Fname;
  var lastName = req.body.ho_Lname;
  var email = req.body.ho_email;
  var zipcode = req.body.ho_zip;
  var pass = req.body.ho_pass;

  models.homeowners.findOne({
      where: {
         id: req.session.userid,
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
            
            res.redirect('homeowner/profile');
          });
      }
    });
});


module.exports = router;