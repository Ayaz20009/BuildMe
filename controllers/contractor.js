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


router.route('/contractor')

router.get('/dashboard', function(req, res) {
  if(!req.session.user)
    return res.status(401).send();
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
      return res.redirect('/login');

  var results = [];
  // Grab data from http request
  // Get a Postgres client from the connection pool
  var queryString = 'SELECT "jobID", "estCost", "estTime", "startDays","comment", "bids"."updatedAt" AS "bidUpdatedAt",'
                  + '"street", "city", "state", "jobs"."zipcode", "jobDesc", "jobs"."updatedAt" AS "jobUpdatedAt", "bidID",'
                  + '"firstName", "lastName"'
                  + 'FROM "job_bids" AS "bids"'
                  + 'JOIN "homeowner_jobs" AS "jobs"'
                  + 'ON "bids"."jobID" = "jobs"."id"'
                  + ' JOIN "homeowners" on "homeowners"."id" = "jobs"."hoID"'
                  + 'WHERE "coID" = '+ req.session.userid
                  // + 'AND "bidID" IS NOT null '
                  + 'ORDER BY "jobUpdatedAt" DESC, "bidUpdatedAt" DESC';
  query = client.query(queryString);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {
      // return res.json(results);
       return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: results});
  });

  //find bids;
    // models.job_bids.findAll({
    //  where: {
    //  coID: req.session.userid,
    //  },
    //  order: '"createdAt" DESC',
    // })
    // .then(function(bids){

       // return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: results});

    // });

  // return res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: GetConBids(req.session.userid) });

});



/*bidding job
*/
router.post('/openbids', function(req,res){

   if(!req.session.user)
      return res.redirect('/login');

  //find the job
   models.homeowner_jobs.findOne({
          where: {
            id: req.body.proj_id,
         }
   }).then(function(job){

    //if find the job
    if(job){

       var jobID = job.id;
       var numBids = job.numBids;
       var coID = req.session.userid;
       var cost = req.body.cost;
       var time = req.body.time;
       var ASAP = req.body.ASAP; 
       var days = 0;
       if(!ASAP)
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

            //update numBids in homeowner_jobs;
            models.homeowner_jobs.findOne({
              where: {
                id: jobID,
             }
            })
            .then(function(home_job){
                
              if(home_job){

                home_job.updateAttributes({
                  numBids : parseInt(numBids) + 1
                })
                .then(function(){

                  //find bids for contracors, redirect to openbids
                    models.job_bids.findAll({
                     where: {
                     coID: coID,
                     },
                     order: '"createdAt" DESC',
                    })
                    .then(function(bids){

                       res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: bids});
          
                    });
                  // res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: GetConBids(coID)});
                });
             }
           });

          }
          else
            res.render('/jobs',{title: "Error", session: req.session});
         });
       }
    }
    //did not find the job : e.g. delelte
    else{

       res.send("Job doesn't exist");
    }

  });//find the job

});


router.get('/wonbids', function(req,res){

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('contractor/wonbids', {title: "Won Bids", session:req.session});
});

router.get('/ongoingjobs', function(req,res){

    if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/ongoingjobs', {title: "Ongoing jobs", session:req.session});
});

router.get('/completedjobs', function(req,res){

  if(!req.session.user)
     return res.redirect('/login');
  return res.render('contractor/completedjobs', {title: "Completed Jobs", session:req.session});
});

router.get('/overview', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
   return res.render('contractor/overview', {title: "Overview", session:req.session});
});

router.get('/message', function(req,res){

   if(!req.session.user)
     return res.redirect('/login');
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
     return res.redirect('/login');
   return res.render('contractor/profile', {title: "Profile", session:req.session});
});






/* @coID, integer, contractorID
Get bids that were created by this contractor
return bids object
*/
function GetConBids(coID){

  // var rs;
  // //find bidss that were created by this user
  // return  models.job_bids.findAll({
  //     where: {
  //        coID: coID,
  //    },
  //     order: '"createdAt" DESC',
  //   }).then(function(bids){

      
  //   });
};

module.exports = router;