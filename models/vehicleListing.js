const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleListingSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },

  dealer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  mileage: {
    type: Number,
    required: true,
    min: 0,
  },

  price: {
    type: Number,
    required: true,
    min: 1,
  },

  color: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },

  location: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "sold"],
    default: "pending",
  },

   images: [
    {
      type: String,
      required: true,
    },
  ],

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const VehicleListing = mongoose.model(
  "VehicleListing",
  vehicleListingSchema
);

function validateVehicleListing(listing) {
  const schema = Joi.object({
    vehicle_id: Joi.objectId().required(),

    dealer_id: Joi.objectId().required(),

    mileage: Joi.number().min(0).required(),

    price: Joi.number().min(1).required(),

    color: Joi.string().min(2).max(50).required(),

    location: Joi.string().min(2).max(100).required(),

    description: Joi.string().min(10).max(1000).required(),

    status: Joi.string().valid(
      "pending",
      "approved",
      "rejected",
      "sold"
    ),

    created_at: Joi.date(),
  });

  return schema.validate(listing);
}

module.exports = {
  VehicleListing,
  validateVehicleListing,
};