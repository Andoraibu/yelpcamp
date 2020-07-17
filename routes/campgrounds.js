let express = require("express")
let router = express.Router()
let Campground = require("../models/campground")
const campground = require("../models/campground")
let Comment = require("../models/comment")
let middleware = require("../middleware")


router.get("/", (req, res) => {
    //Get campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
})
//CREATE - add a new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){         //add middleware here to avoid unauthorized user to post sometheing via Postman
    //get data from form and add to campgrounds array
    let name = req.body.name
    let price = req.body.price
    let image = req.body.image
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: desc, author: author}
    //campgrounds.push(newCampground)   ---> for campground array that has been commented out 
    //Create a new campground in DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds")
        }
    })
    //redirect back
    // res.redirect("/campgrounds")   ---> no need when we don't use camgrounds array

})
// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})

//Show a campground description
router.get("/:id", function( req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})
//EDIT campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})
//UPDATE campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, removedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            //DELETE the corresponded comments
            Comment.deleteMany({
                _id: {
                    $in: removedCampground.comments   //The $in operator selects the campground where the comments are.
                }
            }, err => {
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/campgrounds")
                }
            })
        }
    })
})

module.exports = router;