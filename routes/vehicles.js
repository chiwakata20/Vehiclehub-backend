const express = require("express");
const router = express.Router();

const { Vehicle, validate } = require("../models/vehicle");
const { Category } = require("../models/category");
const upload = require("../middleware/uploads");


// GET all vehicles
router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find().sort("brand");
  res.send(vehicles);
});

// GET single vehicle by ID
router.get("/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).send("Vehicle with the given ID was not found.");
  }

  res.send(vehicle);
});

// CREATE vehicle
router.post("/",upload.array("images", 5), async (req, res) => {

  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.categoryId);

  if (!category) {
    return res.status(400).send("Invalid category.");
  }

    if (!req.files || req.files.length === 0) {
    return res.status(400).send("Please upload at least one vehicle image.");
  }

 
    const imagePaths = req.files.map((file) => {
    return `/uploads/vehicles/${file.filename}`;
  });

 

  const vehicle = new Vehicle({
    brand: req.body.brand,
    model: req.body.model,
    category: {
      _id: category._id,
      name: category.name,
    },
    year: req.body.year,
    engine_type: req.body.engine_type,
    transmission: req.body.transmission,
    fuel_type: req.body.fuel_type,
    seats: req.body.seats,
    images: imagePaths,
  });

  await vehicle.save();

  res.status(201).send(vehicle);
});


// UPDATE vehicle
router.put("/:id",upload.array("images", 5), async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.categoryId);

  if (!category) {
    return res.status(400).send("Invalid category.");
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      brand: req.body.brand,
      model: req.body.model,
      category: {
        _id: category._id,
        name: category.name,
      },
      year: req.body.year,
      engine_type: req.body.engine_type,
      transmission: req.body.transmission,
      fuel_type: req.body.fuel_type,
      seats: req.body.seats,
    },
    {returnDocument: "after"}
  );
   
   if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((file) => {
      return `/uploads/vehicles/${file.filename}`;
    });
  }



 if (!vehicle) {
    return res.status(404).send("Vehicle with the given ID was not found.");
  }

  res.send(vehicle);
});


// DELETE vehicle
router.delete("/:id", async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    return res.status(404).send("Vehicle with the given ID was not found.");
  }

  res.send(vehicle);
});

module.exports = router;