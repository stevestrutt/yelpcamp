
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
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// handling login logic
router.get('/login', function(req, res) {
    res.render('login');
});

// logic route
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/campgrounds');
});

// Authentication middleware needed on every route that needs securing

module.exports = router;
