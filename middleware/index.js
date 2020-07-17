let Campground = require("../models/campground")
let Comment = require("../models/comment")

//all the middleware goes here
let middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in or not -- we check it for permission to edit the comment
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found.")
                res.redirect("back")
            }else{
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next()    //execute the callback 
                }else{
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error", "You need to be logged in.")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in or not -- we check it for permission to edit the comment
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            }else{
                // does user own the campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next()    //execute the callback in the route
                }else{
                    req.flash("error", "You don't have any permission.")
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error", "You need to be logged in.")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "You need to be logged in.") //must be before res.redirect
        res.redirect("/login")
    }
}

module.exports = middlewareObj;