var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
    
    
mongoose.connect("mongodb://localhost:/music-app");
    
//app config
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

//passport configuration, ie. login
app.use(require("express-session")({
    secret: "Once again, this is a secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//give this to all routes.
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
   // console.log(req.user.username);
    next();
})


//RESTful Routes
app.get("/", function(req,res){
    res.render("index");
})


//Sign up route
app.get("/signup", function(req,res){
    res.render("signup");
})

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        })
    })
})

//login route
app.get("/login", function(req,res){
    res.render("login");
})

app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
  
});


//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is green.");
});


