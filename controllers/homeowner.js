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

router.get('/', function(req, res) {
  if(!req.session.user)
    return res.redirect('/login');
});

router.get('/dashboard', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/overview', {title: req.session.user.firstName + "'s dashboard",session: req.session})
});


router.get('/jobscreated', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');

// find projects that were created by this user
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
        //update numCreated of homeowners 
        models.homeowners.findOne({
            where: {
               id: req.session.user.id,
           }
        })
        .then(function(user){

            if(user){
                user.updateAttributes({
                  numCreated : user.numCreated + 1 

                }).then(function(){

                   return res.redirect('/homeowner/jobscreated');
                });
            }
            else
               res.send("user not exists");
        });

      }
      else
        res.render('homeowner/newjob',{title: "Error", session: req.session}) 
    });
  }
  else
    res.render('homeowner/newjob',{title: "Error",error: "Required Fields missing", session: req.session}) 
});


router.get('/newjob', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  return res.render('homeowner/newjob', 
    {title: "Create a job", session: req.session}
    )

});


router.get('/jobsoffering', function(req, res) {

  if(!req.session.user)
    return res.redirect('/login');
  
  models.job_offers.findAll({

    where : {
      hoID : req.session.user.id,
      accepted : null,
    }

  }).then(function(offers){

     // console.log(offers);
     // return res.send(offers);

    return res.render("homeowner/jobsoffering", {title: offers.length + "job offers", offers: offers, session: req.session});

  });

});


router.post('/jobsoffering', function(req, res) {

  var jobID = req.body.jobID;
  var hoID = req.session.user.id;
  var bidID = req.body.bidID;
  var coID = req.body.coID;
  var finalCost = req.body.finalCost;
  var estDays = req.body.estDays;
  var startDate = req.body.startDate;
  var comment = req.body.comment ;

  console.log("jobID: " + jobID );
  console.log("hoID: " + hoID );
  console.log("bidID: " + bidID );
  console.log("coID: " + coID );
  console.log("finalCost: " + finalCost);
  console.log("estDays: " + estDays);
  console.log("startDate: " + startDate);
  console.log("comment: " + comment);

  if(jobID && hoID  && bidID && coID && finalCost && startDate){

    models.job_offers.create({
       jobID:jobID, 
       hoID: hoID,
       bidID: bidID,
       coID : coID,
       finalCost: finalCost,
       estDays: estDays,
       startDate: startDate,
    }).then(function(offer,err){

      if(offer){

          //update numOffers in homeowner
          models.homeowners.findOne({
              where: {
                 id: req.session.user.id,
             }
          }).then(function(user){

              user.updateAttributes({
                numOffers : user.numOffers + 1
              });

              return res.redirect("/homeowner/jobsoffering");
          });
      }
      else
        res.send(err);

    })

  }
  else
    return res.send("required field missing")


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


router.get('/overviewbids',function(req,res) {

   if(!req.session.user && req.session.user.usertype != "homeowner")
    return;

   models.homeowner_jobs.findAll({
      where: {
         hoID: req.session.user.id,
     },
     order: '"createdAt" DESC',
  }).then(function(data){

      res.json(data);
  })
    
});

/*show graphs*/
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


/*
view bids on the job created
*/
router.get('/bids/:jobID', function(req, res) {

//   if(!req.session.user)
//     return res.redirect('/login');

//   var jobID = req.params.jobID;

//   // console.log(jobID);
// // find bids on this job
//   models.job_bids.findAll({
//       where: {
//          jobID: jobID,
//      },
//      order: '"createdAt" DESC',
//   })
//   .then(function(bids){

//       if(bids)
//          res.render('homeowner/bids', {title: bids.length + ' bids', bids: bids, session: req.session});
//   });

  if(!req.session.user && req.session.user.usertype != "homeowner")
    return;
  var jobID = req.params.jobID;

  var results = [];
  var queryString = 'SELECT "bids"."id" AS "bidID", "coID", "estCost", "estDays", "startDate","comment", "bids"."createdAt",'
                  + '"firstName", "lastName", "companyName", "licenseNumber","phoneNumber" '
                  + 'FROM "job_bids" AS "bids" '
                  + 'JOIN "contractors" on "contractors"."id" = "bids"."coID" '
                  + 'WHERE "bids"."jobID" =' + jobID
                  + 'ORDER BY "bids"."createdAt" ASC';

  var query = client.query(queryString);
    // Stream results back one row at a time
  query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {

      return res.render('homeowner/bids', {title: results.length + ' bids', bids: results, session: req.session, jobID : jobID});
  });


});


router.get('/dataBids/:jobID', function(req, res) {

  if(!req.session.user && req.session.user.usertype != "homeowner")
    return;
  var jobID = req.params.jobID;

  var results = [];
  var queryString = 'SELECT "bids"."id" AS "bidID", "coID", "estCost", "estDays", "startDate","comment", "bids"."createdAt", "bids"."updatedAt",'
                  + '"firstName", "lastName", "companyName", "licenseNumber","phoneNumber" '
                  + 'FROM "job_bids" AS "bids" '
                  + 'JOIN "contractors" on "contractors"."id" = "bids"."coID" '
                  + 'WHERE "jobID" =' + jobID
                  + 'ORDER BY "bids"."createdAt" ASC';

  var query = client.query(queryString);
    // Stream results back one row at a time
  query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {

        res.send(results);
  });

});




/**/

module.exports = router;