const mongoose = require("mongoose");
const Joi = require("joi");

const cartItemSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
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

const CartItem = mongoose.model("CartItem", cartItemSchema);

const validateCartItem = (cartItem) => {
  const schema = Joi.object({
    cart_id: Joi.objectId().required(),

    spare_part_id: Joi.objectId().required(),

    quantity: Joi.number().integer().min(1).required(),

    price: Joi.number().min(0).required(),
  });

  return schema.validate(cartItem);
};

exports.CartItem = CartItem;
exports.validate = validateCartItem;