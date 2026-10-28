const express = require("express");
const router = express.Router();

const { CartItem } = require("../models/cartItem");
const { Cart, validate } = require("../models/cart");
const { User } = require("../models/user");


// GET cart with items and total value
router.get("/:id/items", async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate(
    "user_id",
    "name email role"
  );

  if (!cart) {
    return res.status(404).send("Cart with the given ID was not found.");
  }

  const cartItems = await CartItem.find({ cart_id: req.params.id }).populate(
    "spare_part_id",
    "name brand condition_type price stock description"
  );

  const total_value = cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  res.send({
    cart,
    cartItems,
    total_value,
  });
});

// GET all carts
router.get("/", async (req, res) => {
  const carts = await Cart.find()
    .populate("user_id", "name email role")
    .sort("-created_at");

  res.send(carts);
});

// GET one cart by ID
router.get("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate(
    "user_id",
    "name email role"
  );

  if (!cart) {
    return res.status(404).send("Cart with the given ID was not found.");
  }

  res.send(cart);
});

// CREATE cart
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const existingCart = await Cart.findOne({
    user_id: req.body.user_id,
  });

  if (existingCart) {
    return res.status(400).send("This user already has a cart.");
  }

  const cart = new Cart({
    user_id: req.body.user_id,
  });

  await cart.save();

  res.send(cart);
});

// UPDATE cart
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const existingCart = await Cart.findOne({
    user_id: req.body.user_id,
    _id: { $ne: req.params.id },
  });

  if (existingCart) {
    return res.status(400).send("Another cart already uses this user ID.");
  }

  const cart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
    },
    { returnDocument: "after" }
  ).populate("user_id", "name email role");

  if (!cart) {
    return res.status(404).send("Cart with the given ID was not found.");
  }

  res.send(cart);
});

// DELETE cart
router.delete("/:id", async (req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);

  if (!cart) {
    return res.status(404).send("Cart with the given ID was not found.");
  }

  res.send(cart);
});

module.exports = router;