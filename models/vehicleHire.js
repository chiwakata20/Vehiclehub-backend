const mongoose = require("mongoose");
const Joi = require("joi");


const vehicleHireSchema = new mongoose.Schema({
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

  price_per_day: {
    type: Number,
    required: true,
    min: 1,
  },

  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  availability: {
    type: String,
    enum: ["available", "not_available", "booked", "maintenance"],
    default: "available",
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const VehicleHire = mongoose.model("VehicleHire", vehicleHireSchema);

const validateVehicleHire = (vehicleHire) => {
  const schema = Joi.object({
    vehicle_id: Joi.objectId().required(),

    dealer_id: Joi.objectId().required(),

    price_per_day: Joi.number().min(1).required(),

    location: Joi.string().min(2).max(100).required(),

    availability: Joi.string().valid(
      "available",
      "not_available",
      "booked",
      "maintenance"
    ),

    description: Joi.string().min(10).max(1000).required(),

    created_at: Joi.date(),
  });

  return schema.validate(vehicleHire);
};

exports.VehicleHire = VehicleHire;
exports.validate = validateVehicleHire;