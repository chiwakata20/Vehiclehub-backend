const express = require("express");
const router = express.Router();

const { Address, validate } = require("../models/address");
const { User } = require("../models/user");





// GET all addresses
router.get("/", async (req, res) => {
  const addresses = await Address.find()
    .populate("user_id", "name email role")
    .sort("city");

  res.send(addresses);
});

// GET one address by ID
router.get("/:id", async (req, res) => {
  const address = await Address.findById(req.params.id).populate(
    "user_id",
    "name email role"
  );

  if (!address) {
    return res.status(404).send("Address with the given ID was not found.");
  }

  res.send(address);
});

// CREATE address
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const address = new Address({
    user_id: req.body.user_id,
    city: req.body.city,
    street: req.body.street,
    country: req.body.country,
  });

  await address.save();

  res.send(address);
});

// UPDATE address
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const address = await Address.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      city: req.body.city,
      street: req.body.street,
      country: req.body.country,
    },
    { returnDocument: "after" }
  ).populate("user_id", "name email role");

  if (!address) {
    return res.status(404).send("Address with the given ID was not found.");
  }

  res.send(address);
});

// DELETE address
router.delete("/:id", async (req, res) => {
  const address = await Address.findByIdAndDelete(req.params.id);

  if (!address) {
    return res.status(404).send("Address with the given ID was not found.");
  }

  res.send(address);
});

module.exports = router;