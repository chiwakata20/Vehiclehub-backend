const express = require("express");
const router = express.Router();

const { CartItem, validate } = require("../models/cartItem");
const { Cart } = require("../models/cart");
const { SparePart } = require("../models/sparePart");

// GET all cart items
router.get("/", async (req, res) => {
  const cartItems = await CartItem.find()
    .populate({
      path: "cart_id",
      populate: {
        path: "user_id",
        select: "name email role",
      },
    })
    .populate("spare_part_id", "name brand condition_type price stock description");

  res.send(cartItems);
});

// GET one cart item by ID
router.get("/:id", async (req, res) => {
  const cartItem = await CartItem.findById(req.params.id)
    .populate({
      path: "cart_id",
      populate: {
        path: "user_id",
        select: "name email role",
      },
    })
    .populate("spare_part_id", "name brand condition_type price stock description");

  if (!cartItem) {
    return res.status(404).send("Cart item with the given ID was not found.");
  }

  res.send(cartItem);
});

// CREATE cart item
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const cart = await Cart.findById(req.body.cart_id);

  if (!cart) {
    return res.status(400).send("Invalid cart ID.");
  }

  const sparePart = await SparePart.findById(req.body.spare_part_id);

  if (!sparePart) {
    return res.status(400).send("Invalid spare part ID.");
  }

  if (req.body.quantity > sparePart.stock) {
    return res.status(400).send("Quantity is greater than available stock.");
  }

  const existingCartItem = await CartItem.findOne({
    cart_id: req.body.cart_id,
    spare_part_id: req.body.spare_part_id,
  });

  if (existingCartItem) {
    return res.status(400).send("This spare part already exists in the cart.");
  }

  const cartItem = new CartItem({
    cart_id: req.body.cart_id,
    spare_part_id: req.body.spare_part_id,
    quantity: req.body.quantity,
    price: req.body.price,
  });

  await cartItem.save();

  res.send(cartItem);
});

// UPDATE cart item
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const cart = await Cart.findById(req.body.cart_id);

  if (!cart) {
    return res.status(400).send("Invalid cart ID.");
  }

  const sparePart = await SparePart.findById(req.body.spare_part_id);

  if (!sparePart) {
    return res.status(400).send("Invalid spare part ID.");
  }

  if (req.body.quantity > sparePart.stock) {
    return res.status(400).send("Quantity is greater than available stock.");
  }

  const existingCartItem = await CartItem.findOne({
    cart_id: req.body.cart_id,
    spare_part_id: req.body.spare_part_id,
    _id: { $ne: req.params.id },
  });

  if (existingCartItem) {
    return res.status(400).send("This spare part already exists in the cart.");
  }

  const cartItem = await CartItem.findByIdAndUpdate(
    req.params.id,
    {
      cart_id: req.body.cart_id,
      spare_part_id: req.body.spare_part_id,
      quantity: req.body.quantity,
      price: req.body.price,
    },
    { returnDocument: "after" }
  )
    .populate("cart_id")
    .populate("spare_part_id", "name brand condition_type price stock description");

  if (!cartItem) {
    return res.status(404).send("Cart item with the given ID was not found.");
  }

  res.send(cartItem);
});

// DELETE cart item
router.delete("/:id", async (req, res) => {
  const cartItem = await CartItem.findByIdAndDelete(req.params.id);

  if (!cartItem) {
    return res.status(404).send("Cart item with the given ID was not found.");
  }

  res.send(cartItem);
});

module.exports = router;