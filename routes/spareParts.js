const express = require("express");
const router = express.Router();

const { SparePart, validate } = require("../models/sparePart");
const { User } = require("../models/user");
const { Category } = require("../models/category");
const upload = require("../middleware/sparePartUploads");


// GET all spare parts
router.get("/", async (req, res) => {
  const spareParts = await SparePart.find()
    .populate("dealer_id", "name email role")
    .populate("category_id", "name")
    .sort("-created_at");

  res.send(spareParts);
});



// GET single spare part by ID
router.get("/:id", async (req, res) => {
  const sparePart = await SparePart.findById(req.params.id)
    .populate("dealer_id", "name email role")
    .populate("category_id", "name");

  if (!sparePart) {
    return res.status(404).send("Spare part with the given ID was not found.");
  }

  res.send(sparePart);
});


// CREATE spare part
router.post("/", upload.array("images", 5), async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("Please upload at least one spare part image.");
  }

  const dealer = await User.findById(req.body.dealer_id);

  if (!dealer) {
    return res.status(400).send("Invalid dealer ID.");
  }

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected user is not a dealer.");
  }

  const category = await Category.findById(req.body.category_id);

  if (!category) {
    return res.status(400).send("Invalid category ID.");
  }


  const imagePaths = req.files.map((file) => {
    return `/uploads/spareParts/${file.filename}`;
  });

  const sparePart = new SparePart({
    dealer_id: req.body.dealer_id,
    name: req.body.name,
    category_id: req.body.category_id,
    brand: req.body.brand,
    condition_type: req.body.condition_type,
    price: req.body.price,
    stock: req.body.stock,
    description: req.body.description,
    images: imagePaths,
  });

  await sparePart.save();

  res.status(201).send(sparePart);
});


// UPDATE spare part
router.put("/:id",upload.array("images", 5), async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const dealer = await User.findById(req.body.dealer_id);

  if (!dealer) {
    return res.status(400).send("Invalid dealer ID.");
  }

  if (dealer.role !== "dealer") {
    return res.status(400).send("The selected user is not a dealer.");
  }

  const category = await Category.findById(req.body.category_id);

  if (!category) {
    return res.status(400).send("Invalid category ID.");
  }

  const sparePart = await SparePart.findByIdAndUpdate(
    req.params.id,
    {
      dealer_id: req.body.dealer_id,
      name: req.body.name,
      category_id: req.body.category_id,
      brand: req.body.brand,
      condition_type: req.body.condition_type,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
    },
    { returnDocument: "after" }
  );

    if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((file) => {
      return `/uploads/spareParts/${file.filename}`;
    });
  }

  if (!sparePart) {
    return res.status(404).send("Spare part with the given ID was not found.");
  }

  res.send(sparePart);
});

// DELETE spare part
router.delete("/:id", async (req, res) => {
  const sparePart = await SparePart.findByIdAndDelete(req.params.id);

  if (!sparePart) {
    return res.status(404).send("Spare part with the given ID was not found.");
  }

  res.send(sparePart);
});


module.exports = router;