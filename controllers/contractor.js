const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var contractor = require('../controllers/contractor');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
const client = new pg.Client(connectionString);
client.connect();


router.route('/contractor');

router.get('/', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
});

router.get('/dashboard', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
  return res.render('contractor/overview', {title: req.session.user.firstName + "'s dashboard", user : user})
});



/* get open bids of these contractor
*/
router.get('/bidding', function(req,res){

   if(!req.session.user)
      return res.redirect('/login');

  var results = [];
  // Grab data from http request
  // Get a Postgres client from the connection pool
  var queryString = 'SELECT "bids"."id", "jobID", "estCost", "estDays","estHours", "startDate","comment", "bids"."updatedAt" AS "bidUpdatedAt",'
                  + '"bidID", "street", "city", "state", "jobs"."zipcode", "jobDesc", "jobs"."createdAt" AS "jobCreatedAt", "bidID",'
                  + '"firstName", "lastName"'
                  + 'FROM "job_bids" AS "bids"'
                  + 'JOIN "homeowner_jobs" AS "jobs"'
                  + 'ON "bids"."jobID" = "jobs"."id"'
                  + ' JOIN "homeowners" on "homeowners"."id" = "jobs"."hoID"'
                  + 'WHERE "coID" = '+ req.session.userID
                  // + 'AND "bidID" IS NOT null '
                  + 'ORDER BY "jobCreatedAt" DESC, "bidUpdatedAt" DESC';

  query = client.query(queryString);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {
      // return res.json(results);
      if(results.length == 0)
         return res.render('contractor/bidding', {title: results.length + " Bids", user : user});

      return res.render('contractor/bidding', {title: results.length + " Bids", user : user, bids: results});
  });

  

  //find bids;
    // models.job_bids.findAll({
    //  where: {
    //  coID: req.session.userID,
    //  },
    //  order: '"createdAt" DESC',
    // })
    // .then(function(bids){

       // return res.render('contractor/openbids', {title: "Open Bids", user : user, bids: results});

    // });

  // return res.render('contractor/openbids', {title: "Open Bids", user : user, bids: GetConBids(req.session.userID) });

});




router.get('/bidswon', function(req,res){

  if(!req.session.user)
    return res.redirect('/login');

  models.job_offers.findAll({

     where :{
       coID : req.session.userID
     }
  })
  .then(function(offers){

    // return res.send(offers);
    return res.render('contractor/bidswon', {title: "Bids Won", offers: offers,  user : user});

  });
});


router.get('/jobsbookmark', function(req,res){

    if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/jobsbookmark', {title: "Bookmark Jobs", user : user});
});

router.get('/jobsstarted', function(req,res){

    if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/jobsstarted', {title: "Jobs Started", user : user});
});

router.get('/jobscompleted', function(req,res){

  if(!req.session.user)
     return res.redirect('/login');
  return res.render('contractor/jobscompleted', {title: "Jobs Completed", user : user});
});

router.get('/overview', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/overview', {title: "Overview", user : user});
});

router.get('/message', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/message', {title: "Message", user : user});
});


router.get('/points', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/points', {title: "Message", user : user});
});

router.get('/profile',function(req,res){

  if(!req.session.user)
     return res.redirect('/login');

 models.contractors.findOne({
      where: {
         id: req.session.userID,
     }
  }).then(function(user){
    
    res.render('contractor/profile', {title:"profile", user:user, user : user});
  });
});



//update profile
router.post('/profile',function(req,res){

  if(!req.session.user)
     return res.redirect('/login');

  models.contractors.findOne({
      where: {
         id: req.session.userID,
     }
  }).then(function(user){
      if(user){
          user.updateAttributes({
            firstName :    req.body.Fname,
            lastName :     req.body.Lname,
            email :        req.body.email,
            companyName :  req.body.companyName,
            phoneNumber:   req.body.phoneNumber,
            licenseNumber: req.body.licenseNumber
            
          })
          .then(function(user){

            req.session.user = user;
            res.render('contractor/profile', {title:"profile", user : user});
          });
      }
    });

});



module.exports = router;