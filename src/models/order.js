const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending','paid','shipped','completed','cancelled'], default: 'pending' },
  address: { type: String, default: '' } // optional: shipping address
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
