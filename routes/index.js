
var express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    User = require('../models/user');
// Index.js, sometimes also called auth.js

router.get('/', function(req, res) {
    res.render('landing');
});

//= =====================================
// Auth routes
//= =====================================

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    // res.send("post register");
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

// Authentication middleware needed on every route that needs securing

module.exports = router;
