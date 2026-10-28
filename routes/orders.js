const express = require("express");
const router = express.Router();

const { OrderItem } = require("../models/orderItem");
const { Order, validate } = require("../models/order");
const { User } = require("../models/user");

// GET all orders
router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("customer_id", "name email role")
    .sort("-created_at");

  res.send(orders);
});

// GET order with all order items and calculated total
router.get("/:id/items", async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customer_id",
    "name email role"
  );

  if (!order) {
    return res.status(404).send("Order with the given ID was not found.");
  }

  const orderItems = await OrderItem.find({
    order_id: req.params.id,
  }).populate(
    "spare_part_id",
    "name brand condition_type price stock description"
  );

  const total_amount = orderItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  res.send({
    order,
    orderItems,
    total_amount,
  });
});



// GET one order by ID
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customer_id",
    "name email role"
  );

  if (!order) {
    return res.status(404).send("Order with the given ID was not found.");
  }

  res.send(order);
});

// CREATE order
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await User.findById(req.body.customer_id);

  if (!customer) {
    return res.status(400).send("Invalid customer ID.");
  }

  if (customer.role !== "customer") {
    return res.status(400).send("The selected user is not a customer.");
  }

  const order = new Order({
    customer_id: req.body.customer_id,
    total_amount: req.body.total_amount,
  });

  await order.save();

  res.send(order);
});

// UPDATE order
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await User.findById(req.body.customer_id);

  if (!customer) {
    return res.status(400).send("Invalid customer ID.");
  }

  if (customer.role !== "customer") {
    return res.status(400).send("The selected user is not a customer.");
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      customer_id: req.body.customer_id,
      total_amount: req.body.total_amount,
    },
    { returnDocument: "after" }
  ).populate("customer_id", "name email role");

  if (!order) {
    return res.status(404).send("Order with the given ID was not found.");
  }

  res.send(order);
});

// DELETE order
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).send("Order with the given ID was not found.");
  }

  res.send(order);
});

module.exports = router;