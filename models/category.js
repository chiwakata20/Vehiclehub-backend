const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
    maxlength: 50,
    
  }
});

const Category = mongoose.model('Category', categorySchema);

const validateCategory = (category) => {
  const schema = Joi.object ({
    name: Joi.string().min(0).max(50).required(),
    
  });

  return schema.validate(category);
}
exports.categorySchema = categorySchema;
exports.Category = Category; 
exports.validate = validateCategory;