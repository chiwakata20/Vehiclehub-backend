const express = require("express");
const router = express.Router();

const {
  VehicleListing,
  validateVehicleListing,
} = require("../models/vehicleListing");

const { Vehicle } = require("../models/vehicle");
const { User } = require("../models/user");
const upload = require("../middleware/uploads");


// GET all vehicle listings
router.get("/", async (req, res) => {
  const listings = await VehicleListing.find()
    .populate("vehicle_id", "brand model year engine_type transmission fuel_type seats")
    .populate("dealer_id", "name email role")
    .sort("-created_at");

  res.send(listings);
});


// GET one vehicle listing by ID
router.get("/:id", async (req, res) => {
  const listing = await VehicleListing.findById(req.params.id)
    .populate("vehicle_id", 
      "brand model year engine_type transmission fuel_type seats images")
    .populate("dealer_id", "name email role");

  if (!listing) {
    return res.status(404).send("Vehicle listing with the given ID was not found.");
  }

  res.send(listing);
});


router.post("/",upload.array("images", 5), async (req, res) => {
  const { error } = validateVehicleListing(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const vehicle = await Vehicle.findById(req.body.vehicle_id);
  if (!vehicle) return res.status(400).send("Invalid vehicle ID.");

  const dealer = await User.findById(req.body.dealer_id);
  if (!dealer) return res.status(400).send("Invalid dealer ID.");

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected user is not a dealer.");

  }

  const imagePaths = req.files.map((file) => {
    return `/uploads/vehicles/${file.filename}`;
  });

  const listing = new VehicleListing({
    vehicle_id: req.body.vehicle_id,
    dealer_id: req.body.dealer_id,
    mileage: req.body.mileage,
    price: req.body.price,
    color: req.body.color,
    location: req.body.location,
    description: req.body.description,
    status: req.body.status,
    images: imagePaths,
  });

  await listing.save();

  res.status(201).send(listing);
});


// UPDATE vehicle listing
router.put("/:id", async (req, res) => {
  const { error } = validateVehicleListing(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const vehicle = await Vehicle.findById(req.body.vehicle_id);

  if (!vehicle) {
    return res.status(400).send("Invalid vehicle ID.");
  }

  const dealer = await User.findById(req.body.dealer_id);

  if (!dealer) {
    return res.status(400).send("Invalid dealer ID.");
  }

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected user is not a dealer.");
  }

  const listing = await VehicleListing.findByIdAndUpdate(
    req.params.id,
    {
      vehicle_id: req.body.vehicle_id,
      dealer_id: req.body.dealer_id,
      mileage: req.body.mileage,
      price: req.body.price,
      color: req.body.color,
      location: req.body.location,
      description: req.body.description,
      status: req.body.status,
    },
    { returnDocument: "after" }
  );

  if (!listing) {
    return res.status(404).send("Vehicle listing with the given ID was not found.");
  }

  res.send(listing);
});


// DELETE vehicle listing
router.delete("/:id", async (req, res) => {
  const listing = await VehicleListing.findByIdAndDelete(req.params.id);

  if (!listing) {
    return res.status(404).send("Vehicle listing with the given ID was not found.");
  }

  res.send(listing);
});

module.exports = router;