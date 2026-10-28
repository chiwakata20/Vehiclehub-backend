const express = require("express");
const router = express.Router();


const {
  VehicleHireBooking,
  validate,
} = require("../models/vehicleHireBooking");

const { Vehicle } = require("../models/vehicle");
const { User } = require("../models/user");

// GET all vehicle hire bookings
router.get("/", async (req, res) => {
  const bookings = await VehicleHireBooking.find()
    .populate("vehicle_id", "brand model year engine_type transmission fuel_type seats images")
    .populate("customer_id", "name email role")
    .sort("-created_at");

  res.send(bookings);
});

// GET one vehicle hire booking by ID
router.get("/:id", async (req, res) => {
  const booking = await VehicleHireBooking.findById(req.params.id)
    .populate("vehicle_id", "brand model year engine_type transmission fuel_type seats images")
    .populate("customer_id", "name email role");

  if (!booking) {
    return res.status(404).send("Vehicle hire booking with the given ID was not found.");
  }

  res.send(booking);
});

// CREATE vehicle hire booking
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const vehicle = await Vehicle.findById(req.body.vehicle_id);

  if (!vehicle) {
    return res.status(400).send("Invalid vehicle ID.");
  }

  const customer = await User.findById(req.body.customer_id);

  if (!customer) {
    return res.status(400).send("Invalid customer ID.");
  }

  if (customer.role !== "customer") {
    return res.status(400).send("The selected user is not a customer.");
  }

  const booking = new VehicleHireBooking({
    vehicle_id: req.body.vehicle_id,
    customer_id: req.body.customer_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    total_price: req.body.total_price,
    status: req.body.status,
  });

  await booking.save();

   const savedBooking = await VehicleHireBooking.findById(booking._id)
    .populate(
      "vehicle_id",
      "brand model year engine_type transmission fuel_type seats images"
    )
    .populate("customer_id", "name email role");

  res.status(201).send(booking);
});

// UPDATE vehicle hire booking
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const vehicle = await Vehicle.findById(req.body.vehicle_id);

  if (!vehicle) {
    return res.status(400).send("Invalid vehicle ID.");
  }

  const customer = await User.findById(req.body.customer_id);

  if (!customer) {
    return res.status(400).send("Invalid customer ID.");
  }

  if (customer.role !== "customer") {
    return res.status(400).send("The selected user is not a customer.");
  }

  const booking = await VehicleHireBooking.findByIdAndUpdate(
    req.params.id,
    {
      vehicle_id: req.body.vehicle_id,
      customer_id: req.body.customer_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      total_price: req.body.total_price,
      status: req.body.status,
    },
    { returnDocument: "after" }
  );

  if (!booking) {
    return res.status(404).send("Vehicle hire booking with the given ID was not found.");
  }

  res.send(booking);
});

// DELETE vehicle hire booking
router.delete("/:id", async (req, res) => {
  const booking = await VehicleHireBooking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return res.status(404).send("Vehicle hire booking with the given ID was not found.");
  }

  res.send(booking);
});

module.exports = router;