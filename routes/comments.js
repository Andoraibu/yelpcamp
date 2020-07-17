let express = require("express")
let router = express.Router({mergeParams: true})
let Campground = require("../models/campground")
let Comment = require("../models/comment")
let middleware = require("../middleware")

//================
//COMMENTS ROUTES
//================
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground})
        }
    })
})

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong.")
                    console.log(err);
                }else{
                    //add username and ID to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save comment
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success", "Successfully added comment.")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})
//EDIT the comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back")
        }else{
            res.render("comments/edit", {campground_id : req.params.id, comment:foundComment})  //Don't mess up with "campground._id", we need to create "campground_id" (without the dot) to pass it to the "edit" form and be able to find a related comment to edit. Otherwise it throws an error.
        }
    })
})
//UPDATE the comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "Comment has been deleted.")
            res.redirect("/campgrounds/" + req.params.id)  //we redirect such as someone can send a request through Postman, and if we have written here just res.redirect("back"), it would throw an error.
        }
    })
})


module.exports = router;