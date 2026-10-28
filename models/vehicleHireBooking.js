const mongoose = require("mongoose");
const Joi = require("joi");

const vehicleHireBookingSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },

  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  start_date: {
    type: Date,
    required: true,
  },

  end_date: {
    type: Date,
    required: true,
  },

  total_price: {
    type: Number,
    required: true,
    min: 1,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled", "completed"],
    default: "pending",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const VehicleHireBooking = mongoose.model(
  "VehicleHireBooking",
  vehicleHireBookingSchema
);

const validateVehicleHireBooking = (booking) => {
  const schema = Joi.object({
    vehicle_id: Joi.objectId().required(),

    customer_id: Joi.objectId().required(),

    start_date: Joi.date().required(),

    end_date: Joi.date().greater(Joi.ref("start_date")).required().messages({
      "date.greater": "end_date must be after start_date",
    }),

    total_price: Joi.number().min(1).required(),

    status: Joi.string().valid(
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "completed"
    ),

    created_at: Joi.date(),
  });

  return schema.validate(booking);
};

exports.VehicleHireBooking = VehicleHireBooking;
exports.validate = validateVehicleHireBooking;