// src/models/order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  // THÊM TRƯỜNG MỚI: Lưu lại giá tại thời điểm mua
  price: { type: Number, required: true }
}, { _id: false });

// THÊM SCHEMA MỚI: Để lưu thông tin giao hàng
const shippingAddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Nên ref tới 'User' thay vì 'user'
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 }, // Đổi tên totalPrice -> totalAmount cho nhất quán
  status: { type: String, enum: ['pending','paid','shipped','completed','cancelled'], default: 'pending' },
  // THAY THẾ 'address' BẰNG OBJECT 'shippingAddress'
  shippingAddress: { type: shippingAddressSchema, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);