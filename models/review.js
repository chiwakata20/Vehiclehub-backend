const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema({
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  dealer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 1000,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

const validateReview = (review) => {
  const schema = Joi.object({
    reviewer_id: Joi.objectId().required(),

    dealer_id: Joi.objectId().required(),

    rating: Joi.number().min(1).max(5).required(),

    comment: Joi.string().min(3).max(1000).required(),

    created_at: Joi.date(),
  });

  return schema.validate(review);
};

exports.Review = Review;
exports.validate = validateReview;