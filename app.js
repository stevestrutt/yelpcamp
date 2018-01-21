var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    // Campground      = require('./models/campgrounds'),
    // Comment         = require('./models/comments'),
    User            = require('./models/user'),
    // seedDB          = require('./seed'),
    flash           = require('connect-flash'),
    methodOverride  = require('method-override');

// requiring routes
var commentRoutes   = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes     = require('./routes/index');

mongoose.connect('mongodb://localhost/yelpcamp');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// Passport Configuration

app.use(require('express-session')({
    secret: 'Rusty is once again the cutest',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to automatically add username object to each response for display in header
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.set('view engine', 'ejs');

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, function() {
    console.log('server started');
});
