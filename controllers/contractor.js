const express = require('express');
//const fs = require('fs');
// const path = require('path');
const models = require('../models');
const router = express.Router();
var contractor = require('../controllers/contractor');

router.route('/contractor')

router.get('/dashboard', function(req, res) {
  res.render('contractor/dashboard', 
    {title: "Contractor's dashboard"}
  )
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
          console.log(user);
          res.render('contractor/dashboard', {title: user.dataValues.name, user: user.dataValues})
      }
      else{
      	  // req.session.valid = false;
          return res.redirect('/login');
      }

  });
//   .then((contractors) => {

//        res.render('contractor/dashboard', {title: 'Welcome', name: req.body.input_conEmail})
//     }).catch(() => {
//         res.send('ERROR');
//     });;
});

module.exports = router;