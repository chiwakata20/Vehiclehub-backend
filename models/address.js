const mongoose = require("mongoose");
const Joi = require("joi");

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  street: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
  },

  country: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
});

const Address = mongoose.model("Address", addressSchema);

const validateAddress = (address) => {
  const schema = Joi.object({
    user_id: Joi.objectId().required(),

    city: Joi.string().min(2).max(100).required(),

    street: Joi.string().min(2).max(150).required(),

    country: Joi.string().min(2).max(100).required(),
  });

  return schema.validate(address);
};

exports.Address = Address;
exports.validate = validateAddress;