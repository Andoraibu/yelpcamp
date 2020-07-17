let express = require("express")
let router = express.Router()
let passport = require("passport")
let User = require("../models/user")

router.get("/", function(req, res){
    res.render("landing")
})

//===========
//AUTH ROUTES
//===========
//show register form
router.get("/register", function(req, res){
    res.render("register")
})
//handle sign up logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)      //this will show me an error if I try to sign up as the same user
            return res.redirect("/register")
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp, " + user.username)
                res.redirect("/campgrounds")
            })
        }
    })
})

//show login form
router.get("/login", function(req, res){
    res.render("login")
})
//handling login logic
router.post("/login", passport.authenticate("local",     //login, middleware, callback
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
})
//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out!")
    res.redirect("/campgrounds")
})

module.exports = router;