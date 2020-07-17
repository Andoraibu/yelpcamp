let express = require("express")
let app = express()
let bodyParser = require("body-parser")
let mongoose = require("mongoose")
let flash = require("connect-flash")
let Campground = require("./models/campground")
let seedDB = require("./seeds")
let Comment = require("./models/comment")
let passport = require("passport")
let LocalStrategy = require("passport-local")
let User = require("./models/user")
let commentRoutes = require("./routes/comments")
let campgroundRoutes = require("./routes/campgrounds")
let indexRoutes = require("./routes/index")
let methodOverride = require("method-override")


async function start(){
    try{
        await mongoose.connect("mongodb+srv://andrew_mon:1234@cluster0.nzyzk.mongodb.net/test0?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
       // seedDB()
        let server = app.listen(3000, function(){
            let port = server.address().port
            console.log("App's listening port: ", port);
        })
    }catch(e){
        console.log(e);
    }
}

start()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))    //directory where the script is running; it is safer than just "public"
app.use(methodOverride("_method"))
app.use(flash())  //must be before passport config !
//CONFIG PASSPORT
app.use(require("express-session")({
    secret: "secret words",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user   //this adds current user for all routes, not for campgrounds only where we defined currentUser
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)   //:id - mergeParams: true in comments part

// Campground.create(
//     {
//         name: "Salmon Creek", 
//         image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
//         description: "This is a cool brand-new camground with picturesque scenery"
//     }, function(err, campground){
//         if(err){
//             console.log("Error");
//         }else{
//             console.log("Campground created: ");
//             console.log(campground);
//         }
//     })


// let campgrounds = [
//     {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"},
//     {name: "Red Rocks", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142__340.jpg"},
//     {name: "Lagoona Bay", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"},
//     {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg"},
//     {name: "Red Rocks", image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg"},
//     {name: "Lagoona Bay", image: "https://cdn.pixabay.com/photo/2017/04/05/01/15/forest-2203708__340.jpg"}
// ]

