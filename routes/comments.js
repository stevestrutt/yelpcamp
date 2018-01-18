var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    Campground  = require('../models/campgrounds'),
    Comment     = require('../models/comments');

//= ===============================================
// Routes - Comments
//= ===============================================

// Comments NEW
// isLoggedIn defined as middleware to authenticate on every route
router.get('/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log('Error ' + err);
        } else {
            console.log('Campground found ' + foundCampground);
            console.log('xx');
            res.render('comments/new', {campground: foundCampground});
        }
    }
    ); // Find by ID
});

// Comments save

router.post('/', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log('Error ' + err);
            res.redirect('/campgrounds');
        } else {
            console.log('Campground found ' + foundCampground);
            console.log('xx');
            var newComment = req.body.comment;
            Comment.create(newComment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(comment._id);
                    foundCampground.save(function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Call to render new page with added comment');
                            console.log('/campgrounds/' + foundCampground._id);
                            res.redirect('/campgrounds/' + foundCampground._id);
                        }
                    });
                }
            }); // Comment create
        } // else
    }); // Find by ID
});

// Authentication middleware needed on every route that needs securing
function isLoggedIn(req, res, next) {
    console.log('Check for login');
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
