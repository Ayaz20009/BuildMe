const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
  res.render('index')
});

router.get('/jobs', function(req, res) {
  res.render('jobs')
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard')
});

router.get('/howitworks', function(req, res) {
  res.render('HowitWorks')
});

router.get('/searchajob', function(req, res) {
  res.render('searchajob')
});

router.get('/signup', function(req, res) {
  res.render('signup')
});


module.exports = router;