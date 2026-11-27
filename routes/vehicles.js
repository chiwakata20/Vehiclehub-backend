const express = require("express");
const router = express.Router();

const { Vehicle, validate } = require("../models/vehicle");
const { Category } = require("../models/category");
const upload = require("../middleware/uploads");
const {
  upload: vehicleUpload,
  uploadVehiclePhoto,
} = require("../middleware/vehicleUploads");


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
router.post("/", vehicleUpload.array("images", 5), async (req, res, next) => {
  const imageUrls = [];

  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const category = await Category.findById(value.categoryId);
    if (!category) {
      return res.status(400).send("Invalid category.");
    }

    if (!req.files?.length) {
      return res.status(400).send("Please upload at least one vehicle image.");
    }

    // This replaces the old imagePaths block.
    // Upload each photo to Vercel Blob and collect its URL.
    for (const file of req.files) {
      const blob = await uploadVehiclePhoto(file);
      imageUrls.push(blob.url);
    }

    const vehicle = await Vehicle.create({
      brand: value.brand,
      model: value.model,
      category: {
        _id: category._id,
        name: category.name,
      },
      year: value.year,
      engine_type: value.engine_type,
      transmission: value.transmission,
      fuel_type: value.fuel_type,
      seats: value.seats,
      images: imageUrls,
    });

    return res.status(201).send(vehicle);
  } catch (error) {
    // Clean up photos already uploaded if a later upload or the save fails.
    if (imageUrls.length > 0) {
      try {
        const { del } = await import("@vercel/blob");
        await del(imageUrls);
      } catch (cleanupError) {
        console.error("Failed to clean up vehicle photos:", cleanupError);
      }
    }

    return next(error);
  }
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