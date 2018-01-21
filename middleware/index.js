// all middleware goes here
var Campground      = require('../models/campgrounds'),
    Comment         = require('../models/comments'),
    middlewareObj   = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // Does user own campgroun? id's matching
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log('Error occured ' + err);
                req.flash('error', 'Campground not found');
                res.redirect('/campgrounds');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to be logged in to edit');
        req.flash('error', 'You need to be logged in to edit a campground');
        res.redirect('back');
        // res.redirect('/login');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // Does user own campgroun? id's matching
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log('Error occured ' + err);
                res.redirect('/campgrounds');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to be logged in to edit a comment');
        res.redirect('back');
        // res.redirect('/login');
    }
};

// Authentication middleware needed on every route that needs securing
middlewareObj.isLoggedIn = function(req, res, next) {
    console.log('Check for login');
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login first to do that!');
    res.redirect('/login');
};

module.exports = middlewareObj;
