const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  total_amount: {
    type: Number,
    required: true,
    min: 0,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

const validateOrder = (order) => {
  const schema = Joi.object({
    customer_id: Joi.objectId().required(),

    total_amount: Joi.number().min(0).required(),

    created_at: Joi.date(),
  });

  return schema.validate(order);
};

exports.Order = Order;
exports.validate = validateOrder;