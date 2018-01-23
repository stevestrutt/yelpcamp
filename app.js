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
    cfenv           = require('cfenv'),
    methodOverride  = require('method-override');

// requiring routes
var commentRoutes   = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes     = require('./routes/index');

var appEnv          = cfenv.getAppEnv();
var dbuser          = process.env.DBUSER;
var dbpassword      = process.env.DBPASSWORD;
var url = 'mongodb://' + dbuser + ':' + dbpassword + '@ds113648.mlab.com:13648/yelpcampsps2';
console.log(url);
if (appEnv.isLocal === false) {
    url = 'mongodb://localhost/yelpcamp';
}

mongoose.connect(url);
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

var port = '3000';
console.log(appEnv);
if (appEnv.isLocal != true) { port = appEnv.port; }
app.listen(port, function() {
    console.log('server starting on ' + appEnv.bind + ':' + port);
});
