const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' }, 
  stock: { type: Number, default: 0, min: 0 },
  brand: { type: String, required: true, trim: true },
  gender: { type: String, required: true, enum: ['men', 'women', 'unisex'] }, 

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);