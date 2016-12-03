const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var contractor = require('../controllers/contractor');

router.route('/contractor')

router.get('/dashboard', function(req, res) {
  if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/dashboard', {title: "Contractor's dashboard", session:req.session})
});

router.post('/dashboard', function(req, res) {
  var email = req.body.con_email;
  var pass = req.body.con_pass;
  models.contractors.findOne({
      where: {
         email: email,
         // password:pass,
     }
  }).then(function(user){

      if(user){
          req.session.user = "contractor";
          req.session.name = user.dataValues.name;
          req.session.userid = user.dataValues.id;
          res.render('contractor/dashboard', {title: user.dataValues.firstName, session: req.session})
      }
      else
          return res.redirect('/login');

});

});

router.get('/openbids', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else{


    //find bidss that were created by this user
    models.job_bids.findAll({
      where: {
         coID: req.session.userid,
     },
      order: '"createdAt" DESC',
    }).then(function(bids){

      if(bids){
        
         console.log(bids);
         res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: bids});
      }
      else{

      }

    });

  }

});

router.post('/openbids', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else{

   var jobID = req.body.proj_id;
   var coID = req.session.userid;
   var cost = req.body.cost;
   var time = req.body.time;
   var ASAP = req.body.ASAP; 
   var days;
   if(ASAP)
    days = 0;
   else
    days = 30*req.body.months + 7*req.body.weeks + req.body.days;
   var comment = req.body.comment;
   if(jobID && coID && cost && time && days){

     models.job_bids.create({
       jobID: jobID,
       coID: coID,
       estCost: cost,
       estTime: time,
       startDays: days,
       comment : comment,
     }).then(function(bid){

      if(bid){
          res.render('contractor/openbids', {title: "Open Bids", session:req.session});
      }
      else
        res.render('/jobs',{title: "Error", session: req.session});
     });
   }
  
  }

});


router.get('/wonbids', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/wonbids', {title: "Won Bids", session:req.session});
});

router.get('/ongoingjobs', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/ongoingjobs', {title: "Ongoing jobs", session:req.session});
});

router.get('/completedjobs', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/completedjobs', {title: "Completed Jobs", session:req.session});
});

router.get('/overview', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/overview', {title: "Overview", session:req.session});
});

router.get('/message', function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/message', {title: "Message", session:req.session});
});

router.get('/profile',function(req,res){

 models.contractors.findOne({
      where: {
         id: req.session.userid,
     }
  }).then(function(user){
    
    res.render('contractor/profile', {title:"profile", user:user, session:req.session});
  });
});

router.post('/profile',function(req,res){

 if(!req.session.user)
    return res.status(401).send();
  else
   return res.render('contractor/profile', {title: "Profile", session:req.session});
});



module.exports = router;