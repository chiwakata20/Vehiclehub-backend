const mongoose = require('mongoose');
const Joi = require('joi');
const {categorySchema} = require('./category');

const vehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  category: { 
    type: categorySchema,  
    required: true
  },
  
  year: {
    type: Date,
    required: true,
    
  },

  engine_type:{
     type: String,
    required: true,
    trim: true
  },

   transmission:{
     type: String,
    required: true,
    trim: true
  },
   fuel_type:{
     type: String,
    required: true,
    trim: true
  },
   seats:{
     type: Number,
    required: true,
    trim: true
  },
   images: [
    {
      type: String,
    },
  ],

createdAt: {
    type: Date,
    default: Date.now
  }
});


const Vehicle = mongoose.model('Vehicle', vehicleSchema);

const validateVehicle = (vehicle) => {
  const schema = Joi.object ({
   brand: Joi.string().required().min(3).max(100),
   model: Joi.string().required().min(3).max(100),
   year: Joi.date().required(),
   categoryId: Joi.objectId().required(),
   engine_type: Joi.string().required().min(3).max(100),
   transmission: Joi.string().required().min(3).max(100),
   fuel_type: Joi.string().required().min(3).max(100),
   seats: Joi.number().required().min(0),
    images: Joi.array().items(Joi.string()),
  });

  return schema.validate(vehicle);

}


exports.Vehicle = Vehicle; 
exports.validate = validateVehicle;