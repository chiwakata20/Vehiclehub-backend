const express = require("express");
const router = express.Router();

const { Profile, validate } = require("../models/profile");
const { User } = require("../models/user");

// GET all profiles
router.get("/", async (req, res) => {
  const profiles = await Profile.find()
    .populate("user_id", "name email role")
    .sort("user_id");

  res.send(profiles);
});

// GET one profile by ID
router.get("/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id).populate(
    "user_id",
    "name email role"
  );

  if (!profile) {
    return res.status(404).send("Profile with the given ID was not found.");
  }

  res.send(profile);
});

// CREATE profile
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const existingProfile = await Profile.findOne({
    user_id: req.body.user_id,
  });

  if (existingProfile) {
    return res.status(400).send("This user already has a profile.");
  }

  const profile = new Profile({
    user_id: req.body.user_id,
    bio: req.body.bio,
    phone_number: req.body.phone_number,
    date_of_birth: req.body.date_of_birth,
    location: req.body.location,
    loyalty_points: req.body.loyalty_points,
  });

  await profile.save();

  res.send(profile);
});

// UPDATE profile
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user_id);

  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  const existingProfile = await Profile.findOne({
    user_id: req.body.user_id,
    _id: { $ne: req.params.id },
  });

  if (existingProfile) {
    return res.status(400).send("Another profile already uses this user ID.");
  }

  const profile = await Profile.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      bio: req.body.bio,
      phone_number: req.body.phone_number,
      date_of_birth: req.body.date_of_birth,
      location: req.body.location,
      loyalty_points: req.body.loyalty_points,
    },
    { returnDocument: "after" }
  ).populate("user_id", "name email role");

  if (!profile) {
    return res.status(404).send("Profile with the given ID was not found.");
  }

  res.send(profile);
});

// DELETE profile
router.delete("/:id", async (req, res) => {
  const profile = await Profile.findByIdAndDelete(req.params.id);

  if (!profile) {
    return res.status(404).send("Profile with the given ID was not found.");
  }

  res.send(profile);
});

module.exports = router;