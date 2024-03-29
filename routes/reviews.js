const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/expresError")
const joi=require("joi");
const catchAsync=require("../utils/catchAsync");
const reviewSchema=require("../schema");
const Review=require("../models/review");
const Campground = require('../models/campgrounds');

const validateReview=(req,res,next)=>{
    const {error}=ratingSchema.validate(req.body.review);
  
    if(error){
      const msg=error.details.map(el=>el.message).join(",");
    }else{
      next();
    }
}

router.post("/",catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Successfully added your review!")
    res.redirect(`/campgrounds/${campground._id}`)
}))
  
  
router.delete("/:reviewId",catchAsync(async (req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted your review!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;