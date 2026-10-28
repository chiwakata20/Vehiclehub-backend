const mongoose = require("mongoose");
const Joi = require("joi");

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  spare_part_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

const validateOrderItem = (orderItem) => {
  const schema = Joi.object({
    order_id: Joi.objectId().required(),

    spare_part_id: Joi.objectId().required(),

    quantity: Joi.number().integer().min(1).required(),

    price: Joi.number().min(0).required(),
  });

  return schema.validate(orderItem);
};

exports.OrderItem = OrderItem;
exports.validate = validateOrderItem;