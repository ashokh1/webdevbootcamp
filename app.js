var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"), 
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/users"),
    seedDB         = require("./seeds"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash");


var commentRoutes     = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    authRoutes        = require("./routes/index");

// seedDB();    
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am born to do kriya yoga and attain kaivalyam",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// The following code will add res.locals.currentUser" to every single template (all JSs)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, "localhost", function(){
    console.log("Yelpcamp App Started");
});



// Campground.create(
//     {
//         name: "Salmon Creek",
//           image: "https://www.photosforclass.com/download/flickr-37754360946",
//           description: "This is one of a kind of Creek, where you can see Salmons swim upstream"
//     }, function(err, campground){
//         if (err){
//            console.log(err);}
//         else {
//         console.log(campground);}
//     }
// )
    