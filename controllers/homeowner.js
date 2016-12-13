const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');
const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
// const sequelize = new Sequelize("postgres://test_user:test_pass@localhost:5432/buildme_development");


router.route('/homeowner');

router.get('/', function(req, res) {
  if(!req.session.userID)
    return res.redirect('/login');
});




router.get('/dashboard', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

   models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

     if(user)
      return res.render('homeowner/dashboard', {user : user, usertype : "homeowner"});
     else
      return res.send("Homeowner user does not exists.");

   });

});


router.get('/bidding', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

// find jobs that were created by this user
   models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user){

        models.homeowner_jobs.findAll({where: {hoID: user.id, bidID: null},order: '"createdAt" DESC',})

        .then(function(jobs){

          models.job_offers.findAll({ where: {hoID: req.session.userID,},attributes: ['jobID'],})
          .then(function(jobID){ 

             var offerID = [];
             for(var i in jobID)
                offerID.push(jobID[i].jobID);

             return res.render('homeowner/bidding', {user: user, jobs: jobs, offerID: offerID})
          });
         //find offering job ID

       });

    }
    else
      res.send("Homeowner user does not exists.")
  });
  
});


router.delete('/bidding',function(req,res){


  models.homeowner_jobs.findByID(req.body.id).on('success', function(project) {

     project.destroy().on('success', function(u) {
      if (u && u.deletedAt) {
      // successfully deleted the project
       return res.redirect('/homeonwer/bidding');
    }
  })
})

});

router.post('/newjob', function(req, res) {
  
  var hoID = req.session.userID;
  var jobDesc = req.body.jobDesc;
  var street = req.body.street.trim();
  var city = req.body.city;
  var state = req.body.state;
  var zipcode = req.body.zipcode;

  if(hoID && jobDesc && street && city && state){


    models.homeowners.findOne({where: {id: req.session.userID, }})

    .then(function(user){

      if(user){

        models.homeowner_jobs.create({
           hoID: hoID,
           jobDesc: jobDesc,
           street: street,
           city: city,
           state: state,
           zipcode: zipcode, 

        })
        .then(function(job){

          if(job){
            //update numCreated of homeowners 
              user.updateAttributes({numCreated : user.numCreated + 1})
              .then(function(){
                return res.redirect('bidding');
              });
          }
          else
            res.render('homeowner/newjob',{user : user, usertype : "homeowner"}) 
        });
     }
     else
          return res.send("user not exists");
    });
  }
  else
    res.render('homeowner/newjob',{error: "Required Fields missing", user : user, usertype : "homeowner"}) 

});





router.get('/newjob', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

   models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

     if(user)
       return res.render('homeowner/newjob', {user : user, usertype : "homeowner"})
     else
      return res.send("Homeowner user does not exists.");
  });


});


router.get('/offering', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user){

      var queryString = ' SELECT "jobs"."id" AS "jobID", "jobDesc", "street", "city", "state", "estCost", "finalCost", "startDate"'
                       +' "bidID", "contractors".id AS "coID", "firstName", "lastName" , "companyName", "licenseNumber", "phoneNumber"'
                       +' FROM homeowner_jobs AS "jobs"'
                       +' JOIN job_offers AS "offers" ON "jobs".id = "offers"."jobID" '
                       +' JOIN contractors ON "contractors".id = "offers"."coID"'
                       +' WHERE "offers"."hoID" = '+ req.session.userID
                       +' AND "offers"."accepted" is null;'

      sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})

       .then(function(offers) {

           return res.render("homeowner/offering", { offers: offers, user : user, usertype : "homeowner"});

           res.send(results);
       });

    }
    else
      return res.send("Homeowner user does not exists.");

  });

});


router.post('/offering', function(req, res) {

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user){

        var jobID = req.body.jobID;
        var hoID = req.session.userID;
        var bidID = req.body.bidID;
        var coID = req.body.coID;
        var estCost = req.body.estCost;
        var finalCost = req.body.finalCost;
        // var estDays = req.body.estDays;
        // if (estDays == "")
           // estDays = null;
        var startDate = req.body.startDate;
        var comment = req.body.comment ;

        console.log("jobID: " + jobID );
        console.log("hoID: " + hoID );
        console.log("bidID: " + bidID );
        console.log("coID: " + coID );
        console.log("estCost: " + estCost);
        console.log("finalCost: " + finalCost);
        // console.log("estDays: " + estDays);
        console.log("startDate: " + startDate);
        console.log("comment: " + comment);

        if(jobID && hoID  && bidID && coID && finalCost && startDate){

          models.job_offers.create({
             jobID:jobID, 
             hoID: hoID,
             bidID: bidID,
             coID : coID,
             estCost: estCost,
             finalCost: finalCost,
             // estDays: estDays,
             startDate: startDate,
          }).then(function(offer,err){

            if(offer){

                //update numOffers in homeowner
                models.homeowners.findOne({where: {id: req.session.userID,}})

                .then(function(user){
                    user.updateAttributes({numOffers : user.numOffers + 1});
                    return res.redirect("/homeowner/offering");
                });
            }
            else
              res.send(err);
          });
        }
        else
          return res.send("required field missing");
    }
    else
        return res.send("Homeowner user does not exists.");

    });


});


router.get('/started', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');
   
  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user){

      var queryString = ' SELECT "jobs"."id" AS "jobID", "percentage", "jobDesc", "street", "city", "state", "zipcode","estCost", "finalCost", "offers"."startDate"'
                       +' "bidID", "contractors".id AS "coID", "firstName", "lastName" , "companyName", "licenseNumber", "phoneNumber",  "progressID", "percentage", "confirmed" '
                       +' FROM homeowner_jobs AS "jobs"'
                       +' JOIN job_offers AS "offers" ON "jobs".id = "offers"."jobID" '
                       +' JOIN contractors ON "contractors".id = "offers"."coID"'
                       +' JOIN (SELECT id  AS "progressID", "jobID", percentage, confirmed  FROM job_progress WHERE percentage = (SELECT MAX(percentage) FROM job_progress) ) AS "process" ' 
                       +' ON "process"."jobID" = "jobs".id '
                       +' WHERE "offers"."hoID" = '+ req.session.userID
                       +' AND "offers"."accepted" IS TRUE;'

      sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})
       .then(function(jobs) {
        // return res.send(jobs);
        return res.render('homeowner/started',{jobs: jobs , user : user, usertype : "homeowner"})
      });
    }
     else
        return res.send("Homeowner user does not exists.");
  });

});


router.get('/completed', function(req, res) {
  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user)
       return res.render('homeowner/completed', { jobs: [], user : user, usertype : "homeowner"});
     else
        return res.send("Homeowner user does not exists.");
  });

});


router.get('/overviewbids',function(req,res) {

   if(!req.session.userID)
    return res.redirect('/login');

   models.homeowner_jobs.findAll({ where: {hoID: req.session.userID,},order: '"createdAt" DESC',})
   .then(function(data){
      return res.json(data);
  })
    
});

/*show graphs*/
router.get('/overview', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user)
       return res.render('homeowner/overview',{user : user, usertype : "homeowner"})
     else
        return res.send("Homeowner user does not exists.");
  });

});





router.get('/message', function(req, res) {
  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user)
        return res.render('homeowner/message', {user : user, usertype : "homeowner"})
    else
        return res.send("Homeowner user does not exists.");

  });
});


router.get('/points', function(req, res) {
  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

    if(user)
         return res.render('homeowner/points', { points: null , user : user, usertype : "homeowner"})
    else
        return res.send("Homeowner user does not exists.");

  });
});





router.get('/profile', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: {id: req.session.userID,}})

  .then(function(user){

    if(user)
       return res.render('homeowner/profile', {user : user, usertype : "homeowner"});
    else
        return res.send("Homeowner user does not exists.");

  });

});




/* update profile
*/
router.post('/profile', function(req, res) {

  if(!req.session.userID)
     return res.redirect('/login');

  models.homeowners.findOne({where: {id: req.session.userID,}})
  
  .then(function(user){
      if(user){
          user.updateAttributes({
            firstName : req.body.Fname,
            lastName :  req.body.Lname,
            email :     req.body.email.toLowerCase(),
            zipcode :   req.body.zip,
            // pass : pass,
          })
          .then(function(user){

            return res.redirect('profile');
          });
      }
      else
        return res.send("Homeowner user does not exists.");

    });
});


/*
view bids on the job created
*/
router.get('/job_bids/:jobID', function(req, res) {

  if(!req.session.userID)
    return res.redirect('/login');

  models.homeowners.findOne({where: {id: req.session.userID,}})

  .then(function(user){

    if(user){

      var jobID = req.params.jobID;
      
      var queryString = 'SELECT "job"."id" AS "jobID", "jobDesc", "street", "state", "zipcode", "bids"."id" AS "bidID", "bids"."coID", "estCost", "estDays", "bids"."startDate","comment", "bids"."createdAt",'
                  + '"firstName", "lastName", "companyName", "licenseNumber","phoneNumber" '
                  + 'FROM "job_bids" AS "bids" '
                  + 'JOIN "contractors" on "contractors"."id" = "bids"."coID" '
                  + 'JOIN "homeowner_jobs" AS "job" on "job"."id" = "bids"."jobID"' 
                  + 'WHERE "bids"."jobID" =' + jobID 
                  + 'ORDER BY "bids"."createdAt" ASC';

      sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})

      .then(function(results) {


        var queryMax = 'SELECT MAX("estCost") AS "estCost",MAX("estDays") AS "estDays","jobID"' 
                        + 'FROM contractors JOIN job_bids on contractors.id = job_bids."coID"'
                        + 'WHERE "jobID" = ' + jobID
                        + 'GROUP BY "jobID"';
        //get max 
        sequelize.query(queryMax, { type: sequelize.QueryTypes.SELECT}).
        then(function(max){

          console.log(max);

         return res.render('homeowner/job_bids',{bids: results, max: max[0], user : user, usertype : "homeowner"});
        });
      });
    }
    else
        return res.send("Homeowner user does not exists.");

  });

});


router.get('/dataBids/:jobID', function(req, res) {

  // if(!req.session.userID)
  //   return res.redirect('/login');

  var jobID = req.params.jobID;
  var results = [];
  var queryString = 'SELECT "job"."id" AS "jobID", "jobDesc", "street", "city", "state", "zipcode", "bids"."id" AS "bidID", "coID", "estCost", "estDays", "startDate","comment", "bids"."createdAt",'
                  + '"firstName", "lastName", "companyName", "licenseNumber","phoneNumber" '
                  + 'FROM "job_bids" AS "bids" '
                  + 'JOIN "contractors" on "contractors"."id" = "bids"."coID" '
                  + 'JOIN "homeowner_jobs" AS "job" on "job"."id" = "bids"."jobID"' 
                  + 'JOIN "job_offers" AS "offers" on "job"."id" = "offers"."jobID"' 
                  + 'WHERE "bids"."jobID" =' + jobID 
                  + ' AND "offers"."accepted" IS NULL '
                  + 'ORDER BY "bids"."createdAt" ASC';

 sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})

 .then(function(results) {
     res.send(results);
 });


});



/* confirm job progress, update homeower and contractor points */
router.post('/confirmprogress', function(req, res) {

  if(!req.session.userID)
     return res.redirect('/login');

  models.homeowners.findOne({where: {id: req.session.userID,}})
  
  .then(function(user){
      if(user){

        var progressID = req.body.progressID;
        var jobID = req.body.jobID;
        var coID = req.body.coID;
        var percentage = req.body.percentage;
        var finalCost = req.body.finalCost;

        //find last confirmed percentage;
        var queryString1 = 'SELECT percentage FROM job_progress' +  
                           ' WHERE confirmed IS NOT NULL AND "jobID" = '+ jobID + ' AND id <> '+ progressID  +
                           ' ORDER BY id DESC LIMIT 1';
         sequelize.query(queryString1, { type: sequelize.QueryTypes.SELECT})
         .then(function(confirmed){

             //calculate points
             var points;
             if(confirmed.length == 0)
                points = percentage/100 * finalCost;
             else
                points = (percentage - confirmed[0].percentage)/100 * finalCost;

            //update in job_process
            var queryString = 'UPDATE job_progress SET confirmed = true, points = '+ points +', "updatedAt" = CURRENT_TIMESTAMP WHERE id= '+ progressID ;
            
            sequelize.query(queryString).spread(function (row, updated){

                //update points for homeowner 
                user.updateAttributes({points : user.points + points})
                .then((updated) => {}).catch(() => {
                  return res.send('ERROR');
                });
                
                //contractor
                models.contractors.findOne({where: { id: coID}})
                .then(function(coUser){
                     coUser.updateAttributes({points : coUser.points + points});
                })
                .then((updated) => {}).catch(() => {
                  return res.send('ERROR');
                });

                return res.redirect("/homeowner/started");
            });

         });
            
      }
      else
        return res.send("Homeowner user does not exists.");

    });
});



/**/

module.exports = router;