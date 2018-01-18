var express = require('express'),
    router  = express.Router(),
    Campground = require('../models/campgrounds');

//= ===============================================
// Routes - Campground
//= ===============================================

// Campgrounds index
router.get('/', function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log('Error occured ' + err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    }); // Campground.find
});

// Campgrounds New
router.post('/', function(req, res) {
    var name            = req.body.name,
        image           = req.body.image, // Get data from form
        description     = req.body.description,
        newCampground   = {name: name, image: image, description: description};
    console.log(' returned data' + name, image);
    Campground.create(newCampground, function(err, newCampground) {
        if (err) {
            console.log('Error occured ' + err);
        } else {
            res.redirect('/campgrounds');
        }
    }); // Campground.create

    // get data from array
    // res.send
});

// Campgrounds new display page
router.get('/new', function(req, res) {
    res.render('campgrounds/new');
});

// Show more info about the campground
router.get('/:id', function(req, res) {
    // find campground using provided id
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log('Error occured ' + err);
        } else {
            // found campground, iuncludes comments due to populate.exec
            console.log('Show detail for campground: ' + foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// Authentication middleware needed on every route that needs securing

module.exports = router;
