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
     return res.render('index',{title: "Build Me", session:req.session});

});

router.get('/contractor-signup',function(req,res){
   if(!req.session.user)
    return res.render('contractor-signup', {title: 'Contractor Sign Up'});
   else
     return res.render('contractor-signup', {title: 'Contractor Sign Up', session:req.session});
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
   return res.render('homeowner-signup',{title: "Homeowner Sign Up", session:req.session});


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



/*get all jobs created by all users
*/
router.get('/jobs', function(req, res) {

  console.log(req.session.user.usertype);

  var results = [];
  var queryString = 'SELECT "jobs"."id", "street", "city", "state", "jobs"."zipcode", "jobDesc", "jobs"."createdAt", "jobs"."updatedAt", "bidID",'
                  + '"firstName", "lastName" '
                  + 'FROM "homeowner_jobs" AS "jobs" '
                  + 'JOIN "homeowners" on "homeowners"."id" = "jobs"."hoID" '
                  + 'WHERE "bidID" IS null '
                  + 'ORDER BY "jobs"."createdAt" DESC';

  query = client.query(queryString);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
  // After all data is returned, close connection and return results
  query.on('end', () => {
      // return res.json(results);
      // if(!req.session)
        if(req.session.user && req.session.usertype != "homeowner" )
          return res.render('jobs', {title: 'Jobs', projects:results, session:req.session, contractor: true});
         
        return res.render('jobs', {title: 'Jobs', projects:results,session:req.session});
      // else
      //   return res.render('jobs', {title: 'Jobs', projects:results, session:req.session, contractor: true});
  });

  // models.homeowner_jobs.findAll()
  // .then(function(projects){
  //   if(projects){

  //      if(!req.session.user)
  //        return res.render('jobs', {title: 'Jobs',projects:projects});
  //      else
  //        return res.render('jobs', {title: 'Jobs',projects:projects, session: req.session});
  //   }
  // });

});


router.post('/jobs',function(req,res){

  if(!req.session.user)
      return res.redirect('/login');

  //find the job
   models.homeowner_jobs.findOne({
          where: {
            id: req.body.jobID,
         }
   }).then(function(job){

    //if find the job
    if(job){

       var jobID = job.id;
       var numBids = job.numBids;
       var coID = req.session.user.id;
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

                   res.redirect('/jobs');

                  //find bids for contracors, redirect to openbids
                    // models.job_bids.findAll({
                    //  where: {
                    //  coID: coID,
                    //  },
                    //  order: '"createdAt" DESC',
                    // })
                    // .then(function(bids){

                    //    res.render('contractor/openbids', {title: "Open Bids", session:req.session, bids: bids});
          
                    // });
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



   // res.redirect('/jobs');

});

router.get('/howitworks', function(req, res) {
   if(!req.session.user)
     return res.render('HowitWorks', {title: 'How it Works'}) 
   else
     return res.render('HowitWorks', {title: 'How it Works',session: req.session})
});

router.get('/searchajob', function(req, res) {
  if(!req.session.user)
    return res.render('searchajob', {title: 'Search A job'})
  else
    res.render('searchajob', {title: 'Search A job',session: req.session})
});

router.get('/login', function(req, res) {
  if(!req.session.user)
   return res.render('login', {title: 'Login'})
  else
   return res.render('login', {title: 'Login',session: req.session})


});



router.post('/homeowner-login', function(req, res) {
  var email = req.body.home_email.toLowerCase();
  var pass = req.body.home_pass;
  models.homeowners.findOne({
      where: {
         email: email,
         // password:pass,
     },
  }).then(function(user){

      if(user){

          req.session.user = user.dataValues;
          req.session.user.usertype = "homeowner";
          res.render('homeowner/dashboard', 
            {title: user.dataValues.firstName + " " + user.dataValues.lastName, session: req.session})
      }
      else
          return res.redirect('/login');
  });

});


/*
*/
router.post('/contractor-login', function(req, res) {
  var email = req.body.con_email.toLowerCase();
  var pass = req.body.con_pass;
  models.contractors.findOne({
      where: {
         email: email,
         // password:pass,
     }
  }).then(function(user){

      if(user){
          req.session.user = user;
          req.session.user.usertype = "contractor";
          console.log(req.session.user.usertype);

          res.render('contractor/dashboard', {title: user.dataValues.firstName, session: req.session})
      }
      else
          return res.redirect('/login');
  });
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



module.exports = router;