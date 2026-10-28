const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 1,
  },

  payment_method: {
    type: String,
    required: true,
    enum: ["cash", "ecocash", "onemoney", "innbucks", "bank_transfer", "card"],
  },

  payment_status: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled", "refunded"],
    default: "pending",
  },

   paid_at: {
    type: Date,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

const validatePayment = (payment) => {
  const schema = Joi.object({
    order_id: Joi.objectId().required(),

    amount: Joi.number().min(1).required(),

    payment_method: Joi.string()
      .valid("cash", "ecocash", "onemoney", "innbucks", "bank_transfer", "card")
      .required(),

    payment_status: Joi.string().valid(
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded"
    ),

    created_at: Joi.date(),
  });

  return schema.validate(payment);
};

exports.Payment = Payment;
exports.validate = validatePayment;