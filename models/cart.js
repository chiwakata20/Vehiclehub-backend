const mongoose = require("mongoose");
const Joi = require("joi");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

const validateCart = (cart) => {
  const schema = Joi.object({
    user_id: Joi.objectId().required(),

    created_at: Joi.date(),
  });

  return schema.validate(cart);
};

exports.Cart = Cart;
exports.validate = validateCart;