const express = require('express');
//const fs = require('fs');
const path = require('path');
const models = require('../models');
const router = express.Router();
//const basename = path.basename(module.filename);
const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://pg_user:pg_pass@localhost:5432/buildme_development");
// const sequelize = new Sequelize("postgres://test_user:test_pass@localhost:5432/buildme_development");

// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
// const client = new pg.Client(connectionString);
// client.connect();

// fs
//   .readdirSync(__dirname)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach(file => {
//     const fileName = file.substr(0, file.length - 3);
//     router.use(`/${fileName}`, require(`./${fileName}`).registerRouter());
//   });


router.use('/homeowner', require('./homeowner'));
router.use('/contractor', require('./contractor'));

/*main page*/

router.get('/', (req, res) => {


   if(!req.session.userID)
     return res.render('index');
   else{

     if(req.session.usertype == "homeowner")
        models.homeowners.findOne({ where: { id: req.session.userID } }).then(function(user){

           if(user)
             return res.render('index', {user:user , usertype: req.session.usertype});
           else
             return res.render('index');

        });

     if(req.session.usertype == "contractor")
         models.contractors.findOne({ where: { id: req.session.userID } }).then(function(user){
           if(user)
             return res.render('index', {user:user , usertype: req.session.usertype});
           else
             return res.render('index');
        });
   }

});


router.get('/contractor-signup',function(req,res){

   if(!req.session.userID)
    return res.render('contractor-signup');
   else
    return res.redirect("logout");

});

router.post('/contractor-signup',function(req,res,next){
  if(req.body.firstName &&
    req.body.lastName &&
    req.body.companyName &&
    req.body.phoneNumber &&
    req.body.licenseNumber &&
    req.body.email &&
    req.body.password){

    models.contractors.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    licenseNumber: req.body.licenseNumber,
    email: req.body.email.toLowerCase(),
    password: req.body.password
    }).then((contractors) => {
        res.redirect('/login');
    }).catch(() => {
        res.send('ERROR');
    });

  }else{
    var err = new Error('All fields required');
    err.status = 400;
    return next(err);
  }

});

router.get('/homeowner-signup',function(req,res){

  if(!req.session.userID)
   return res.render('homeowner-signup');
  else
    return res.redirect("logout");
});

router.post('/homeowner-signup',function(req,res,next){
  if(req.body.firstName &&
     req.body.lastName &&
     req.body.zipcode &&
     req.body.email &&
     req.body.password){


  models.homeowners.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    zipcode: req.body.zipcode,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    }).then((homeowners) => {
        res.redirect('/login');
    }).catch(() => {
        res.send('ERROR');
    });

}else{
  var err = new Error('All fields required');
  err.status = 400;
  return next(err);
}
});



/*get all jobs 
*/
router.get('/jobs', function(req,res){

  //generate search query condition
   var searchString = "";
   var keywords;

   if(req.query){

      keywords = "";

      for(var col in req.query){

         if(req.query[col]){

            keywords += " " + req.query[col];

            var wordSplit = req.query[col].split(" ");
            for(var i in wordSplit){

              if(col == "zipcode")
                  // searchString +=' AND \"jobs\".\"'+ col +'\" like \'%'+ wordSplit[i] + '%\' ';
                 searchString += "";
              else if(col == "date")
                 searchString += "";  //add later
              else
                searchString +=' AND \"'+ col +'\" like \'%'+ wordSplit[i] + '%\' ';

            }
         }
      }
   }

    var  queryString  = 'SELECT "jobs"."id" AS "jobID","jobs"."hoID", "street", "city",'
                  + '"state", "jobs"."zipcode", "jobDesc", "jobs"."createdAt", "jobs"."updatedAt", "bidID"'
                  // + '"firstName", "lastName" '
                  + 'FROM "homeowner_jobs" AS "jobs" '
                  // + 'JOIN "homeowners" on "homeowners"."id" = "jobs"."hoID" '
                  + 'WHERE "bidID" IS null ' + searchString
                  + ' ORDER BY "jobs"."createdAt" DESC';


    sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT})
 
    .then(function(results) {

        // // return res.json(results);
        // console.log(req.session.usertype );

        // if(req.session.userID && req.session.usertype == "homeowner")

        //     models.homeowners.findOne({where: { id : req.session.userID} })
        //     .then(function(user) {
        //        if(user)
        //          return res.render('jobs', {jobs:results, keywords : keywords, user : user, usertype : req.session.usertype}); 
        //        else
        //          return res.render('jobs', {jobs:results, keywords : keywords}); 
        //     });


        // if(req.session.userID && req.session.usertype == "contractor")

        //     models.contractors.findOne({where: { id : req.session.userID} })
        //     .then(function(user) {

        //       if(user)

        //          models.job_bids.findAll({ where: {coID: req.session.userID,}, attributes: ['jobID'],})
        //          .then(function(bids){

        //              if(bids){

        //               var bidJobID = [];
        //               for(var i in bids)
        //                  bidJobID.push(bids[i].jobID);
        //                  return res.render('jobs', { jobs:results, bidJobID: bidJobID, keywords : keywords, user : user, usertype : req.session.usertype}); 
        //              
        //              else
        //                 return res.render('jobs', {jobs:results, keywords : keywords,user : user, usertype : req.session.usertype}); 
        //          });
        //       else
        //          return res.render('jobs', { jobs:results, keywords : keywords, }); 
        //     });

        // return res.render('jobs', {jobs:results, keywords : keywords}); 

         // return res.json(results);
        if(!req.session.userID)
            return res.render('jobs', {jobs:results, keywords : keywords,});

        else if(req.session.userID && req.session.usertype == "homeowner"){

            models.homeowners.findOne({where: { id : req.session.userID} }).then(function(user) {

              return res.render('jobs', { jobs:results, keywords : keywords, user : user, usertype : "homeowner"}); 
            });
        }
        else{
                 //if contractor , first get the job that alreday bidden by the contractor
            models.job_bids.findAll({ where: {coID: req.session.userID,},attributes: ['jobID'],})

            .then(function(bids){

               var bidJobID;

               if(bids){
                 bidJobID = [];
                 //get the id 
                 for(var i in bids)
                   bidJobID.push(bids[i].jobID);
                }

                 models.contractors.findOne({where: { id : req.session.userID} }).then(function(user) {
                 return res.render('jobs', { jobs:results, bidJobID :bidJobID, keywords : keywords, user : user, usertype : "contractor"}); 
                
                });
           });

        }
    
    });
});


/*bid on the job ,contractor only
*/
router.post('/jobs',function(req,res){

  if(!req.session.userID)
      return res.redirect('/login');

   var jobID = req.body.jobID;
   var coID = req.session.userID;
   var estCost = req.body.estCost;
   var estDays = req.body.estDays;
   var estHours = req.body.estHours;
   var startDate = req.body.startDate;
   var comment = req.body.comment;

   if(estDays == "")
        estDays = 0;
      if(estHours == "")
        estHours = 0;
  
   // console.log("jobID: " + jobID);
   // console.log("coID: " + coID);
   // console.log("estCost: " + estCost);
   // console.log("estDays " + estDays);
   // console.log("estHours " + estHours);
   // console.log("startDate: " + startDate);
   // console.log("comment: " + comment);

   //valid input
  if(jobID && coID && estCost && 
    (estDays != 0 || estHours != 0 ) && startDate != "" ) {

      //find if the job still exist or open
       models.homeowner_jobs.findOne({
              where: {
                id: req.body.jobID,
                bidID : null
             }
       })
       .then(function(job){

          if(job){
            //find the job, create bid
               models.job_bids.create({
                 jobID: jobID,
                 coID: coID,
                 estCost: estCost,
                 estDays:  estDays,
                 estHours: estHours,
                 startDate: startDate,
                 comment : comment,
               }).then(function(bid){

                 if(bid){
                      //update value of numBids at homeowner_jobs;
                       job.updateAttributes({                      
                         numBids : job.numBids + 1,
                    });
                      //update numBids
                      models.contractors.findOne({ where: { id: req.session.userID } })
                      .then(function(user){

                          user.updateAttributes({                      
                           numBids : user.numBids + 1,
                         });
                      });
                     
                    return res.redirect('/jobs');
                  }
                });

           }
          //did not find the job : e.g. delelte
          else{
            res.send("Job doesn't exist or the bidding was closed");
            // return res.redirect('/jobs');
          }
             
       });
   }
   else{
           res.send("required fields missing.");
   }



});

router.get('/howitworks', function(req, res) {

  if(!req.session.userID)
     return res.render('HowitWorks');
   else{

     if(req.session.usertype == "homeowner")
        
        models.homeowners.findOne({ where: { id: req.session.userID } }).then(function(user){

           if(user)
             return res.render('HowitWorks', {user:user , usertype: req.session.usertype});
           else
             return res.render('HowitWorks');

        });

     if(req.session.usertype == "contractor")
        
        models.contractors.findOne({ where: { id: req.session.userID } }).then(function(user){
           if(user)
             return res.render('HowitWorks', {user:user , usertype: req.session.usertype});
           else
             return res.render('HowitWorks');
        });
   }

});



router.get('/login', function(req, res) {

  if(!req.session.userID)
   return res.render('login');

  else{
    if(req.session.usertype == "homeowner")
       res.redirect("/homeowner/dashboard");

    if(req.session.usertype == "contractor")
       res.redirect("/contractor/dashboard");
  }

});


/*Homeowenrs or contractors login */

router.post('/login', function(req, res) {

  var usertype = req.body.usertype;
  console.log(usertype);
  var email = req.body.email.toLowerCase();
  var pass = req.body.pass;
  if(usertype == "homeowner"){

      models.homeowners.findOne({
          where: {
             email: email,
             // password:pass,
         },
      }).then(function(user){

          if(user){
              req.session.userID = user.id;
              req.session.usertype = "homeowner";
              // console.log(req.session.usertype);
              return res.redirect('/homeowner/dashboard');
          }
          else
            return res.render('login', {error: true})
      });
  }

  if(usertype == "contractor"){

       models.contractors.findOne({
          where: {
             email: email,
             // password:pass,
         },
       }).then(function(user){

        if(user){
            req.session.userID = user.id;
            req.session.usertype = "contractor";
            res.redirect('/contractor/dashboard');
        }
        else
          return res.render('login', {error: true})
    });

  }

});


router.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Log out successully");
        res.redirect('/');
      }
  });
});

/*show address on the google map */
router.get("/map/:jobID",function(req, res){

   var jobID = req.params.jobID;

   models.homeowner_jobs.findOne({
      where: {
         id: jobID,
     },
  }).then(function(job){
    var  address = job.street + " " + job.city + " " + job.state + " " + job.zipcode;
    return res.render('map', {address:  address});
  });
  
   
});






module.exports = router;