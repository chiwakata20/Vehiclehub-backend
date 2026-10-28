
const {Category, validate} = require('../models/category');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const category = await Category.find().sort('name');
  res.send(category);
});


router.post('/',async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let category = await Category.findOne({ name: req.body.email });
  if (category) return res.status(400).send('Category already registered.');

  category = new Category({ name: req.body.name });
  category = await category.save();
  
  res.send(category).status(201);
});

module.exports = router;