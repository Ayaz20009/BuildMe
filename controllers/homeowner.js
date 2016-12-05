const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
const client = new pg.Client(connectionString);
client.connect();


router.route('/contractor')


router.get('/dashboard', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/dashboard', {title: req.session.user.firstName + "'s dashboard",session: req.session})
});


router.get('/jobscreated', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');

//find projects that were created by this user
  models.homeowner_jobs.findAll({
      where: {
         hoID: req.session.user.id,
     },
     order: '"createdAt" DESC',
  }).then(function(projects){

      if(projects){
          // console.log(projects);
          res.render('homeowner/jobscreated', 
          {title: projects.length + " jobs created", session: req.session, projects: projects})
      }
      else{

         res.render('homeowner/jobscreated', {session: req.session});
      }

  });

});


router.delete('/jobscreated',function(req,res){

  console.log(req.body.proj_id);
  models.homeowner_jobs.findByID(req.body.proj_id).on('success', function(project) {

     project.destroy().on('success', function(u) {
      if (u && u.deletedAt) {
      // successfully deleted the project
       return res.redirect('/homeonwer/jobscreated');
    }
  })
})

});

router.post('/newjob', function(req, res) {
  var hoID = req.session.user.id;
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
          return res.redirect('/homeowner/jobsbidding');
      }
      else
        res.render('homeowner/newjob',{title: "Error", session: req.session}) 
    });
  }
  else
    res.render('homeowner/newjob',{title: "Error", session: req.session}) 
});


router.get('/newjob', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/newjob', 
    {title: "Create a job", session: req.session}
    )

});


router.get('/jobsoffered', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/jobsoffered', 
    {title: "Job Offered", session: req.session}
    )

});


router.get('/jobsstarted', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/jobsstarted', 
    {title: "Job started", session: req.session}
    )

});

router.get('/jobscompleted', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/jobscompleted', 
    {title: "completedjobs", session: req.session}
    )
});

router.get('/overview', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/overview', 
    {title: "overview",session: req.session})
});

router.get('/message', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/message', 
    {title: "message", session: req.session}
    )
});


router.get('/points', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/points', 
    {title: "points", session: req.session}
    )
});


router.get('/profile', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');

  models.homeowners.findOne({
      where: {
         id: req.session.user.id,
     }
  }).then(function(user){
    
    res.render('homeowner/profile', {title:"profile", user:user, session:req.session});
  });

});

router.post('/profile', function(req, res) {

  if(!req.session.user)
     return res.redirect('/login');

  models.homeowners.findOne({
      where: {
         id: req.session.user.id,
     }
  }).then(function(user){
      if(user){
          user.updateAttributes({
            firstName : req.body.Fname,
            lastName :  req.body.Lname,
            email :     req.body.email.toLowerCase(),
            zipcode :   req.body.zip,
            // pass : pass,
          })
          .then(function(user){

            req.session.user = user;
            
            res.render('homeowner/profile', {title:"profile", session:req.session});
          });
      }
    });
});


module.exports = router;