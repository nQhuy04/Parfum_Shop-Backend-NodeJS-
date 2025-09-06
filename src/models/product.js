const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' }, // URL ảnh
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, default: 'perfume' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
