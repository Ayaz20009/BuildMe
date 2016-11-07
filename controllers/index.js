const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
  res.render('index', {title: 'Build Me'})
});

router.get('/jobs', function(req, res) {
  res.render('jobs', {title: 'Jobs'})
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {title: 'Dashboard'})
});

router.get('/howitworks', function(req, res) {
  res.render('HowitWorks', {title: 'How it Works'})
});

router.get('/searchajob', function(req, res) {
  res.render('searchajob', {title: 'Search A job'})
});

router.get('/signup', function(req, res) {
  res.render('signup', {title: 'Sign Up'})

});



module.exports = router;