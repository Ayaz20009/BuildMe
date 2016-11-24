const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var homeowner = require('../controllers/homeowner');

router.route('/homeowner')

router.get('/dashboard', function(req, res) {
  res.render('homeowner/dashboard', 
    {title: "homeowner's dashboard"}
    )
});

router.post('/dashboard', function(req, res) {
  var email = req.body.home_email;
  var pass = req.body.home_pass;
  console.log(email)
  models.homeowners.findOne({
      where: {
         email: email,
         // password:pass,
     }
  }).then(function(user){

      if(user){
          console.log(user);
          res.render('homeowner/dashboard', {title: user.dataValues.firstName, user: user.dataValues})
      }
      else{
      	  // req.session.valid = false;
          return res.redirect('/login');
      }

  });
});

module.exports = router;