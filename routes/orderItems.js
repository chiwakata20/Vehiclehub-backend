const express = require("express");
const router = express.Router();

const { OrderItem, validate } = require("../models/orderItem");
const { Order } = require("../models/order");
const { SparePart } = require("../models/sparePart");

// GET all order items
router.get("/", async (req, res) => {
  const orderItems = await OrderItem.find()
    .populate({
      path: "order_id",
      populate: {
        path: "customer_id",
        select: "name email role",
      },
    })
    .populate("spare_part_id", "name brand condition_type price stock description");

  res.send(orderItems);
});

// GET one order item by ID
router.get("/:id", async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id)
    .populate({
      path: "order_id",
      populate: {
        path: "customer_id",
        select: "name email role",
      },
    })
    .populate("spare_part_id", "name brand condition_type price stock description");

  if (!orderItem) {
    return res.status(404).send("Order item with the given ID was not found.");
  }

  res.send(orderItem);
});

// CREATE order item
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findById(req.body.order_id);

  if (!order) {
    return res.status(400).send("Invalid order ID.");
  }

  const sparePart = await SparePart.findById(req.body.spare_part_id);

  if (!sparePart) {
    return res.status(400).send("Invalid spare part ID.");
  }

  if (req.body.quantity > sparePart.stock) {
    return res.status(400).send("Quantity is greater than available stock.");
  }

  const orderItem = new OrderItem({
    order_id: req.body.order_id,
    spare_part_id: req.body.spare_part_id,
    quantity: req.body.quantity,
    price: req.body.price,
  });

  await orderItem.save();

  res.send(orderItem);
});

// UPDATE order item
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const order = await Order.findById(req.body.order_id);

  if (!order) {
    return res.status(400).send("Invalid order ID.");
  }

  const sparePart = await SparePart.findById(req.body.spare_part_id);

  if (!sparePart) {
    return res.status(400).send("Invalid spare part ID.");
  }

  if (req.body.quantity > sparePart.stock) {
    return res.status(400).send("Quantity is greater than available stock.");
  }

  const orderItem = await OrderItem.findByIdAndUpdate(
    req.params.id,
    {
      order_id: req.body.order_id,
      spare_part_id: req.body.spare_part_id,
      quantity: req.body.quantity,
      price: req.body.price,
    },
    { returnDocument: "after" }
  )
    .populate("order_id")
    .populate("spare_part_id", "name brand condition_type price stock description");

  if (!orderItem) {
    return res.status(404).send("Order item with the given ID was not found.");
  }

  res.send(orderItem);
});

// DELETE order item
router.delete("/:id", async (req, res) => {
  const orderItem = await OrderItem.findByIdAndDelete(req.params.id);

  if (!orderItem) {
    return res.status(404).send("Order item with the given ID was not found.");
  }

  res.send(orderItem);
});

module.exports = router;