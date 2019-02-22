var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
    Comment    = require("../models/comment"),
    mongoose       = require("mongoose");
var middleware = require("../middleware");  


router.get("/", function(req, res){
    Campground.find({}, function(err, campgroundsdb){
        if (err)
           console.log(err);
        else   
        res.render("campgrounds/index", {campgroundsejs:campgroundsdb});
    })
    
})

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW CAMPGROUNDS

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
        res.render("campgrounds/show", {showcampground: foundCampground});
    }
});
})

//EDIT CAMPGROUNDS
router.get("/:id/edit", middleware.checkCGOwner, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit",{campgroundedit: foundCampground});
        });            
});

// UPDATE CAMPGROUNDS

router.put("/:id", middleware.checkCGOwner, function(req, res){
     
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
        function(err, updatedCampgrounds) {
            if (err){
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        } )
})

//DELETE CAMPGROUND ROUTE

router.delete("/:id",middleware.checkCGOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, 
        function(err, deletedCampground) {
            if (err){
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds");
            }

        });

})

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var imageurl = req.body.imageurl;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: imageurl, description: description, 
       author: author };
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
          console.log(err);
        }
        else {
          res.redirect("/");      
        }
    });
});

module.exports = router;