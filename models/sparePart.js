const mongoose = require("mongoose");
const Joi = require("joi");

const sparePartSchema = new mongoose.Schema({
  dealer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  brand: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  condition_type: {
    type: String,
    required: true,
    enum: ["new", "used", "refurbished"],
    default: "new",
  },

  price: {
    type: Number,
    required: true,
    min: 1,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000,
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

const SparePart = mongoose.model("SparePart", sparePartSchema);

const validateSparePart = (sparePart) => {
  const schema = Joi.object({
    dealer_id: Joi.objectId().required(),

    name: Joi.string().min(2).max(100).required(),

    category_id: Joi.objectId().required(),

    brand: Joi.string().min(2).max(100).required(),

    condition_type: Joi.string()
      .valid("new", "used", "refurbished")
      .required(),

    price: Joi.number().min(1).required(),

    stock: Joi.number().min(0).required(),

    description: Joi.string().min(10).max(1000).required(),

    created_at: Joi.date(),
  });

  return schema.validate(sparePart);
};

exports.SparePart = SparePart;
exports.validate = validateSparePart;