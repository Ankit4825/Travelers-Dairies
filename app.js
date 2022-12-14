const express          = require('express'),
      partials         = require('express-partials'),
      bodyParser       = require('body-parser'),
      passport         = require('passport'),
      passportLocal    = require('passport-local'),
      flash            = require('connect-flash'),
      app              = express(),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      User             = require('./models/user')

const commentRouter    = require('./routes/comment'),
      campgroundRouter = require('./routes/campground'),
      indexRouter      = require('./routes/index');

mongoose.connect(`mongodb://0.0.0.0:27017/yelpcampground`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   // useFindAndModify: false
});

app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Passport Configuration
app.use(require('express-session')({
    secret: 'pizza over pasta',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'));

app.use(flash());

// pass the current user to every request
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    res.locals.dark = req.flash('dark');
    next();
});

app.use('/', indexRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/comments', commentRouter);

app.get('/', (req, res) => {
    res.render('landing');
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server started on 3000');
});

