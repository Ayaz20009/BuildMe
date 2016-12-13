const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var contractor = require('../controllers/contractor');
const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
// const sequelize = new Sequelize("postgres://test_user:test_pass@localhost:5432/buildme_development");


router.route('/contractor');



router.get('/', function(req, res) {
  if(!req.session.userID)
    return res.redirect('/login');
});



router.get('/dashboard', function(req, res) {

    if(!req.session.userID)
    return res.redirect('/login');

    models.contractors.findOne({where: { id : req.session.userID} }).then(function(user) {

     if(user)
       return res.render('contractor/dashboard', {user : user, usertype : "contractor"});
     else
       return res.send("Contractor user does not exists.");

   });

});



/* get open bids of these contractor
*/
router.get('/bidding', function(req,res){

  if(!req.session.userID)
      return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}})

  .then(function(user){

      if(user){

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
                        + 'ORDER BY "jobCreatedAt" DESC, "bidUpdatedAt" DESC';

         sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})

         .then(function(results) {

            return res.render('contractor/bidding', {user : user, bids: results, usertype: "contractor"});
         });

      }
      else
        return res.send("Contractor user does not exists.");

  });

  //find bids;
    // models.job_bids.findAll({
    //  where: {
    //  coID: req.session.userID,
    //  },
    //  order: '"createdAt" DESC',
    // })
    // .then(function(bids){

       // return res.render('contractor/openbids', {user : user, bids: results});

    // });

  // return res.render('contractor/openbids', { user : user, bids: GetConBids(req.session.userID) });

});




router.get('/bidswon', function(req,res){

  if(!req.session.userID)
    return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if(user){

      var queryString = ' SELECT "offers".id AS "offerID","jobs"."id" AS "jobID", "jobDesc", "city", "state", "zipcode",'
                       +' "offers"."bidID", "finalCost", "estCost", "estDays", "offers"."startDate", "offers".accepted'
                       +' FROM homeowner_jobs AS "jobs"'
                       +' JOIN job_offers AS "offers" ON "jobs".id = "offers"."jobID" '
                       // +' JOIN job_bids AS "bids" ON "bids".id = "offers"."bidID"'
                       +' WHERE "offers"."coID" = '+ req.session.userID
                       // +' AND "offers"."accepted" IS null'
                       ;

      sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})

      .then(function(offers) {
        // return res.send(offers);
         return res.render('contractor/bidswon', {offers: offers,  user : user, usertype: req.session.usertype});
      });
    }
    else
       return res.send("Contractor user does not exists.");

  });

});


router.post("/acceptjob",function(req,res){

  var offerID = req.body.offerID;
  if(!req.session.userID)
    return res.redirect('/login');

   models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user){
    //update job_ offers 

       models.job_offers.findOne({where: {id: offerID,}}).then(function(offer){

         if(offer){

            queryString = 'INSERT INTO job_progress ("jobID", "createdAt", "updatedAt") VALUES ('+ offer.jobID + ',  CURRENT_TIMESTAMP ,  CURRENT_TIMESTAMP )';
            //create one job started
            sequelize.query(queryString);
        //     if(p){
            // update offer accept
            offer.updateAttributes({accepted : true,});

            //udpate contractor numStarted
            user.updateAttributes({numStarted: user.numStarted + 1,});
             
            //update homeowner numStared
            models.homeowners.findOne({where: {id: offer.hoID,}}).
            then(function(hoUser){
              hoUser.updateAttributes({numStarted: hoUser.numStarted + 1,});
            });

            //update homeowner_jobs; bidID
            models.homeowner_jobs.findOne({where: {id: offer.jobID,}}).
            then(function(job){
              job.updateAttributes({bidID: offer.bidID,});
            });
            // });

            return res.redirect("started");
         }
         else
           return res.send("The Job offer does not exists.");


      });
      
    }
    else
       return res.send("Contractor user does not exists.");
  });


});

/*bookmark*/

router.get('/bookmark', function(req,res){

  if(!req.session.userID)
    return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user)
      return res.render('contractor/bookmark', {jobs : [], user : user, usertype: req.session.usertype});
    else
       return res.send("Contractor user does not exists.");
  });

});



router.get('/started', function(req,res){

  if(!req.session.userID)
    return res.redirect('/login');

   models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if(user){

      var queryString = ' SELECT "offers".id AS "offerID","jobs"."id" AS "jobID", "jobDesc", "city", "state", "zipcode",'
                       +' "offers"."bidID", "finalCost", "estCost", "estDays", "offers"."startDate", "percentage" , "confirmed", "pointsEarned" '
                       +' FROM homeowner_jobs AS "jobs"'
                       +' JOIN job_offers AS "offers" ON "jobs".id = "offers"."jobID" '
                       // +' JOIN job_bids AS "bids" ON "bids".id = "offers"."bidID"'
                       +' JOIN (SELECT id  AS "progressID", "jobID", percentage, confirmed' 
                              +' FROM job_progress WHERE percentage = (SELECT MAX(percentage) FROM job_progress) ) AS "process" ON "process"."jobID" = "jobs".id '
                       + 'JOIN (SELECT "jobID", SUM(points) AS "pointsEarned" FROM job_progress GROUP by "jobID") AS "points" ON "points"."jobID" = "jobs".id '
                       +' WHERE "offers"."coID" = '+ req.session.userID
                       +' AND "offers"."accepted" IS TRUE';

      sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})
       .then(function(jobs) {
        // return res.send(offers);
         return res.render('contractor/started', {jobs: jobs,  user : user, usertype: req.session.usertype});
      });
    }
    else
       return res.send("Contractor user does not exists.");
   });

});


/*
  get completed jobs
*/
router.get('/completed', function(req,res){

  if(!req.session.userID)
     return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user)
      return res.render('contractor/completed', {jobs : [], user : user, usertype: req.session.usertype});
    else
      return res.send("Contractor user does not exists.");
  });

});

/*
  get overview data visualization
*/


router.get('/overview', function(req,res){

  if(!req.session.userID)
    return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user)
     return res.render('contractor/overview', { user : user, usertype: req.session.usertype});
    else
      return res.send("Contractor user does not exists.");
  });

});



/*
  get message
*/
router.get('/message', function(req,res){

   if(!req.session.userID)
     return res.redirect('/login');

   models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user)
      return res.render('contractor/message', {user : user, usertype: req.session.usertype});
    else
      return res.send("Contractor user does not exists.");
  });


});

/*
  get points
*/

router.get('/points', function(req,res){

  if(!req.session.userID)
    return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

      if (user)
        return res.render('contractor/points', {user : user , usertype : req.session.usertype});
      else
        return res.send("Contractor user does not exists.");
  });

});

router.get('/profile',function(req,res){

  if(!req.session.userID)
     return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

    if (user)
      return res.render('contractor/profile', {user:user, usertype : req.session.usertype});
    else
      return res.send("Contractor user does not exists.");
  });

});



//update profile
router.post('/profile',function(req,res){

  if(!req.session.userID)
     return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

      if(user){
          user.updateAttributes({
            firstName :    req.body.Fname,
            lastName :     req.body.Lname,
            email :        req.body.email,
            companyName :  req.body.companyName,
            phoneNumber:   req.body.phoneNumber,
            licenseNumber: req.body.licenseNumber
            
          }).then(function(user){
            return res.redirect("profile");
          });
      }
      else
         return res.send("Contractor user does not exists.");
    });

});

//create progress in job_progress

router.post('/updateprogress',function(req,res){

  // if(!req.session.userID)
  //    return res.redirect('/login');

  models.contractors.findOne({where: {id: req.session.userID,}}).then(function(user){

      if(user){

        var jobID = req.body.jobID;
        var percentage = parseFloat(req.body.percentage.trim());
        var updatedPercentage = parseFloat(req.body.updatedPercentage.trim());

        if(updatedPercentage > percentage)
          //create one job progress
            var queryString = 'INSERT INTO job_progress ("jobID", "percentage", "createdAt", "updatedAt") VALUES ('+ jobID + ', '+ updatedPercentage +', CURRENT_TIMESTAMP ,  CURRENT_TIMESTAMP )';
            sequelize.query(queryString).spread(function (row, created){
              
              return res.redirect("/contractor/started");
          });

      }
      else
         return res.send("Contractor user does not exists.");
    });

});





module.exports = router;