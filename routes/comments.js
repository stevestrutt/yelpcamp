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
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment._id);
                    foundCampground.save(function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/campgrounds/' + foundCampground._id);
                        }
                    });
                }
            }); // Comment create
        } // else
    }); // Find by ID
});

router.get('/:comment_id/edit', checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log('Error ' + err);
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put('/:comment_id', checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// COMMENT DESTORY ROUTE
router.delete('/:comment_id', checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log('Comment delete error ' + err);
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Authentication middleware needed on every route that needs securing
function isLoggedIn(req, res, next) {
    console.log('Check for login');
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Authorisation middleware
function checkCommentOwnership(req, res, next) {
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
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to be logged in to edit');
        res.redirect('back');
        // res.redirect('/login');
    }
}

module.exports = router;
