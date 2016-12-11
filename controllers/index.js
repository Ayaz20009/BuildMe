const express = require('express');
//const fs = require('fs');
const path = require('path');
const models = require('../models');
const router = express.Router();
//const basename = path.basename(module.filename);

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/buildme_development';
const client = new pg.Client(connectionString);
client.connect();

// fs
//   .readdirSync(__dirname)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach(file => {
//     const fileName = file.substr(0, file.length - 3);
//     router.use(`/${fileName}`, require(`./${fileName}`).registerRouter());
//   });


router.use('/homeowner', require('./homeowner'));
router.use('/contractor', require('./contractor'));

router.get('/', (req, res) => {

   if(!req.session.user)
     return res.render('index',{title: "Build Me"});
   else
     return res.render('index',{title: "Build Me", user : user});

});



router.get('/contractor-signup',function(req,res){
   if(!req.session.user)
    return res.render('contractor-signup', {title: 'Contractor Sign Up'});
   else
     return res.render('contractor-signup', {title: 'Contractor Sign Up', user : user});
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
  if(!req.session.user)
   return res.render('homeowner-signup',{title: "Homeowner Sign Up"});
 else
   return res.render('homeowner-signup',{title: "Homeowner Sign Up", user : user});


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

   if(req.query){

      for(var col in req.query){

         if(req.query[col]){

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

    console.log(queryString);

    var results = [];

    var query = client.query(queryString);
      // Stream results back one row at a time
    query.on('row', (row) => {
        results.push(row);
      });
    // After all data is returned, close connection and return results
    query.on('end', () => {
        // return res.json(results);
        if(!req.session.user)
            return res.render('jobs', {title: 'Jobs', jobs:results, });
        else{

            if(req.session.user && req.session.user.usertype == "homeowner"){

                return res.render('jobs', {title: 'Jobs', jobs:results, user : user}); 
            }
            else{
                 //if contractor , first get the job that alreday bidden by the contractor
                models.job_bids.findAll({
                    where: {
                       coID: req.session.userID,
                   },
                    attributes: ['jobID'], 
                }).then(function(bids){

                    var bidJobID = [];
                    //get the id 
                    for(var i in bids )
                       bidJobID.push(bids[i].jobID);

                    return res.render('jobs',
                      {title: results.length + ' Jobs', job:results, bidJobID : bidJobID, user : user}
                    ); 
               });
            }
        }
    });

});


/*bid on the job ,contractor only
*/
router.post('/jobs',function(req,res){

  if(!req.session.user)
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
  
   console.log("jobID: " + jobID);
   console.log("coID: " + coID);
   console.log("estCost: " + estCost);
   console.log("estDays " + estDays);
   console.log("estHours " + estHours);
   console.log("startDate: " + startDate);
   console.log("comment: " + comment);

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
   if(!req.session.user)
     return res.render('HowitWorks', {title: 'How it Works'}) 
   else
     return res.render('HowitWorks', {title: 'How it Works',user : user})
});





router.get('/login', function(req, res) {
  if(!req.session.user)
   return res.render('login', {title: 'Login'})
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

              return res.redirect('/homeowner/dashboard');
          }
          else
            return res.render('login', {error: true, title: 'Error'})
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
            res.redirect('/contractor/dashboard');
        }
        else
          return res.render('login', {error: true, title: 'Error'})
    });

  }

});


router.get('/logout', function(req, res) {
  req.session.user = null;
  req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
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
    return res.render('map', {title: "Map", address:  address});
  });
  
   
});






module.exports = router;