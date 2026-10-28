const mongoose = require("mongoose");
const Joi = require("joi");

const profileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  bio: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 1000,
  },

  phone_number: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    maxlength: 20,
  },

  date_of_birth: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  loyalty_points: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

const validateProfile = (profile) => {
  const schema = Joi.object({
    user_id: Joi.objectId().required(),

    bio: Joi.string().min(10).max(1000),

    phone_number: Joi.string().min(7).max(20).required(),

    date_of_birth: Joi.date().required(),

    location: Joi.string().min(2).max(100).required(),

    loyalty_points: Joi.number().min(0),
  });

  return schema.validate(profile);
};

exports.Profile = Profile;
exports.validate = validateProfile;