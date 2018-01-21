var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    Campground  = require('../models/campgrounds'),
    Comment     = require('../models/comments'),
    middleware = require('../middleware');

//= ===============================================
// Routes - Comments
//= ===============================================

// Comments NEW
// isLoggedIn defined as middleware to authenticate on every route
router.get('/new', middleware.isLoggedIn, function(req, res) {
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

router.post('/', middleware.isLoggedIn, function(req, res) {
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
                    req.flash('error', 'Something went wrong on the comment create');
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
                            req.flash('success', 'Successfully added comment');
                            res.redirect('/campgrounds/' + foundCampground._id);
                        }
                    });
                }
            }); // Comment create
        } // else
    }); // Find by ID
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log('Error ' + err);
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
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
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log('Comment delete error ' + err);
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;
