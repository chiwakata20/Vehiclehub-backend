const express = require("express");
const router = express.Router();

const { Review, validate } = require("../models/review");
const { User } = require("../models/user");

// GET all reviews
router.get("/", async (req, res) => {
  const reviews = await Review.find()
    .populate("reviewer_id", "name email role")
    .populate("dealer_id", "name email role")
    .sort("-created_at");

  res.send(reviews);
});

// GET one review by ID
router.get("/:id", async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate("reviewer_id", "name email role")
    .populate("dealer_id", "name email role");

  if (!review) {
    return res.status(404).send("Review with the given ID was not found.");
  }

  res.send(review);
});

// CREATE review
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const reviewer = await User.findById(req.body.reviewer_id);

  if (!reviewer) {
    return res.status(400).send("Invalid reviewer ID.");
  }

  const dealer = await User.findById(req.body.dealer_id);

  if (!dealer) {
    return res.status(400).send("Invalid dealer ID.");
  }

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected dealer_id is not a dealer.");
  }

  if (req.body.reviewer_id === req.body.dealer_id) {
    return res.status(400).send("A user cannot review themselves.");
  }

  const review = new Review({
    reviewer_id: req.body.reviewer_id,
    dealer_id: req.body.dealer_id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  await review.save();

  res.send(review);
});

// UPDATE review
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const reviewer = await User.findById(req.body.reviewer_id);

  if (!reviewer) {
    return res.status(400).send("Invalid reviewer ID.");
  }

  const dealer = await User.findById(req.body.dealer_id);

  if (!dealer) {
    return res.status(400).send("Invalid dealer ID.");
  }

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected dealer_id is not a dealer.");
  }

  if (req.body.reviewer_id === req.body.dealer_id) {
    return res.status(400).send("A user cannot review themselves.");
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      reviewer_id: req.body.reviewer_id,
      dealer_id: req.body.dealer_id,
      rating: req.body.rating,
      comment: req.body.comment,
    },
    { returnDocument: "after" }
  )
    .populate("reviewer_id", "name email role")
    .populate("dealer_id", "name email role");

  if (!review) {
    return res.status(404).send("Review with the given ID was not found.");
  }

  res.send(review);
});

// DELETE review
router.delete("/:id", async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).send("Review with the given ID was not found.");
  }

  res.send(review);
});

module.exports = router;