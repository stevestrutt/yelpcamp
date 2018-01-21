var express = require('express'),
    router  = express.Router(),
    Campground = require('../models/campgrounds'),
    middleware = require('../middleware');

//= ===============================================
// Routes - Campground
//= ===============================================

// root routefor showing campsites
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
router.post('/', middleware.isLoggedIn, function(req, res) {
    var name            = req.body.name,
        image           = req.body.image, // Get data from form
        description     = req.body.description,
        author          = {
            id: req.user._id,
            username: req.user.username
        },
        newCampground   = {name: name, image: image, description: description, author: author};
    console.log(' returned data' + name, image);
    Campground.create(newCampground, function(err, newCampground) {
        if (err) {
            console.log('Error occured ' + err);
        } else {
            console.log(newCampground);
            res.redirect('/campgrounds');
        }
    }); // Campground.create

    // get data from array
    // res.send
});

// Campgrounds new display page
router.get('/new', middleware.isLoggedIn, function(req, res) {
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

// Edit route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log('Error occured ' + err);
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

// Update route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log('Error occured ' + err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log('Error occured ' + err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});



module.exports = router;
