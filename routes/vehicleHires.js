const express = require("express");
const router = express.Router();

const { VehicleHire, validate } = require("../models/vehicleHire");
const { Vehicle } = require("../models/vehicle");
const { User } = require("../models/user");





// GET all vehicle hire listings
router.get("/", async (req, res) => {
  const vehicleHires = await VehicleHire.find()
    .populate("vehicle_id", "brand model year engine_type transmission fuel_type seats images")
    .populate("dealer_id", "name email role")
    .sort("-created_at");

  res.send(vehicleHires);
});

// GET one vehicle hire listing
router.get("/:id", async (req, res) => {
  const vehicleHire = await VehicleHire.findById(req.params.id)
    .populate("vehicle_id", "brand model year engine_type transmission fuel_type seats images")
    .populate("dealer_id", "name email role");

  if (!vehicleHire) {
    return res.status(404).send("Vehicle hire listing with the given ID was not found.");
  }

  res.send(vehicleHire);
});

// CREATE vehicle hire listing
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

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

  const vehicleHire = new VehicleHire({
    vehicle_id: req.body.vehicle_id,
    dealer_id: req.body.dealer_id,
    price_per_day: req.body.price_per_day,
    location: req.body.location,
    availability: req.body.availability,
    description: req.body.description,
  });

  await vehicleHire.save();

  const savedVehicleHire = await VehicleHire.findById(vehicleHire._id)
    .populate(
      "vehicle_id",
      "brand model year engine_type transmission fuel_type seats images"
    )
    .populate("dealer_id", "name email role");

  res.status(201).send(vehicleHire);
});


// UPDATE vehicle hire listing
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const vehicle = await Vehicle.findById(req.body.vehicle_id);
  if (!vehicle) return res.status(400).send("Invalid vehicle ID.");

  const dealer = await User.findById(req.body.dealer_id);
  if (!dealer) return res.status(400).send("Invalid dealer ID.");

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected user is not a dealer.");
  }

  const vehicleHire = await VehicleHire.findByIdAndUpdate(
    req.params.id,
    {
      vehicle_id: req.body.vehicle_id,
      dealer_id: req.body.dealer_id,
      price_per_day: req.body.price_per_day,
      location: req.body.location,
      availability: req.body.availability,
      description: req.body.description,
    },
    { returnDocument: "after" }
  );

  if (!vehicleHire) {
    return res.status(404).send("Vehicle hire listing with the given ID was not found.");
  }

  res.send(vehicleHire);
});


// DELETE vehicle hire listing
router.delete("/:id", async (req, res) => {
  const vehicleHire = await VehicleHire.findByIdAndDelete(req.params.id);

  if (!vehicleHire) {
    return res.status(404).send("Vehicle hire listing with the given ID was not found.");
  }

  res.send(vehicleHire);
});



module.exports = router;