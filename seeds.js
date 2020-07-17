let mongoose = require("mongoose")
let Campground = require("./models/campground")
let Comment = require("./models/comment")

let data = [
        {
            name: "Salmon Creek", 
            image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
            description: "This is a cool brand-new camground with picturesque scenery. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, in exercitationem. Natus amet quos reprehenderit rem sequi vel commodi est dicta perspiciatis qui iste quaerat asperiores doloremque sapiente, et quidem ea laudantium repudiandae dolores saepe culpa, veniam molestiae! Error velit ex voluptate illo consequatur debitis cupiditate possimus veritatis saepe? Rem eum, aperiam iste consectetur nam asperiores possimus voluptas harum similique."
        },
        {
            name: "Red Rocks", 
            image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142__340.jpg",
            description: "This is a cool brand-new camground with picturesque scenery"
        },
        {
            name: "Lagoona Bay", 
            image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
            description: "This is a cool brand-new camground with picturesque scenery"
        }
    ]

function seedDB(){
    //erase all the collection entries
    Campground.deleteMany({}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log(`Deleted ${result.deletedCount} items.`);
        
        //add a few new campgrounds
        data.forEach(seed => {
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a campground.");
                   //  create a comment
                    Comment.create(
                        {
                            text: "spiritual scenery!11",
                            author: "Homer Simpson."
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment)
                                campground.save()
                                console.log("Created a new comment.");
                            }
                    })
                }
            })
        })
     })
}

module.exports = seedDB;