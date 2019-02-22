// all middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

middlewareObj.checkCGOwner = function(req, res, next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                // console.log(foundCampground);
                if (err){
                    req.flash("error", "Oops! something wrong, Campground Not Found");
                    res.redirect("back");
                } else {
                    // console.log(JSON.stringify(foundCampground.author.id));
                    // console.log(JSON.stringify(req.user._id));
                    if (foundCampground.author.id.equals(req.user._id))
                      {
                         next();
                      } 
                    else
                       {
                          req.flash("error", "You do not create this campground, so you cannot edit/delete");
                          res.redirect("back");
                       }
                }
                })
        } else {
            req.flash("error", "You have to be logged in first");
            res.redirect("back");
        }
    }

    middlewareObj.checkCommentOwner = function(req, res, next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                // console.log(foundCampground);
                if (err){
                    res.redirect("back");
                } else {
                    if (foundComment.author.id.equals(req.user._id))
                      {
                         next();
                      } 
                    else
                       {
                          res.redirect("back");
                       }
                }
                })
        } else {
            res.redirect("back");
        }
    }

    middlewareObj.isLoggedIn = function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("success", "Please login first");
        res.redirect("/login");
    }
    
    

module.exports = middlewareObj;

