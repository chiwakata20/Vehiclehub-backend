const mongoose = require("mongoose");
const Joi = require("joi");

const sparePartVehicleSchema = new mongoose.Schema({
  spare_part_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart",
    required: true,
  },

  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const SparePartVehicle = mongoose.model(
  "SparePartVehicle",
  sparePartVehicleSchema
);

const validateSparePartVehicle = (sparePartVehicle) => {
  const schema = Joi.object({
    spare_part_id: Joi.objectId().required(),

    vehicle_id: Joi.objectId().required(),

    created_at: Joi.date(),
  });

  return schema.validate(sparePartVehicle);
};

exports.SparePartVehicle = SparePartVehicle;
exports.validate = validateSparePartVehicle;