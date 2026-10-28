const express = require("express");
const router = express.Router();

const { Payment, validate } = require("../models/payment");
const { Order } = require("../models/order");

// GET all payments
router.get("/", async (req, res) => {
  const payments = await Payment.find()
    .populate({
      path: "order_id",
      populate: {
        path: "customer_id",
        select: "name email role",
      },
    })
    .sort("-created_at");

  res.send(payments);
});

// GET one payment by ID
router.get("/:id", async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate({
    path: "order_id",
    populate: {
      path: "customer_id",
      select: "name email role",
    },
  });

  if (!payment) {
    return res.status(404).send("Payment with the given ID was not found.");
  }

  res.send(payment);
});

// CREATE payment
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findById(req.body.order_id);

  if (!order) {
    return res.status(400).send("Invalid order ID.");
  }

  const payment = new Payment({
    order_id: req.body.order_id,
    amount: req.body.amount,
    payment_method: req.body.payment_method,
    payment_status: req.body.payment_status,
  });

  await payment.save();

  res.send(payment);
});

// UPDATE payment
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findById(req.body.order_id);

  if (!order) {
    return res.status(400).send("Invalid order ID.");
  }

  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    {
      order_id: req.body.order_id,
      amount: req.body.amount,
      payment_method: req.body.payment_method,
      payment_status: req.body.payment_status,
    },
    { returnDocument: "after" }
  ).populate({
    path: "order_id",
    populate: {
      path: "customer_id",
      select: "name email role",
    },
  });

  if (!payment) {
    return res.status(404).send("Payment with the given ID was not found.");
  }

  res.send(payment);
});

// DELETE payment
router.delete("/:id", async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);

  if (!payment) {
    return res.status(404).send("Payment with the given ID was not found.");
  }

  res.send(payment);
});

router.put("/:id/confirm", async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).send("Payment with the given ID was not found.");
  }

  if (payment.payment_status === "paid") {
    return res.status(400).send("Payment is already paid.");
  }

  payment.payment_status = "paid";
  payment.paid_at = new Date();

  if (req.body && req.body.transaction_reference) {
    payment.transaction_reference = req.body.transaction_reference;
  }

  await payment.save();

  const confirmedPayment = await Payment.findById(payment._id).populate({
    path: "order_id",
    populate: {
      path: "customer_id",
      select: "name email role",
    },
  });

  res.send(confirmedPayment);
});

module.exports = router;