// src/services/orderService.js
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

/**
 * createOrder:
 *  - validate items
 *  - check product tồn tại & stock
 *  - tạo order
 *  - giảm stock
 *  - clear cart của user
 *  - trả về order đã populate (user + items.product)
 */
const createOrder = async ({ userId, items, address = '' }) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return { EC: 1, EM: 'Vui lòng gửi items (mảng các sản phẩm)', DT: null };
    }

    // validate format của mỗi item
    for (const it of items) {
      if (!it.product || !mongoose.Types.ObjectId.isValid(it.product)) {
        return { EC: 2, EM: `Product id không hợp lệ: ${it.product}`, DT: null };
      }
      if (!it.quantity || Number(it.quantity) <= 0) {
        return { EC: 3, EM: `Quantity không hợp lệ cho product ${it.product}`, DT: null };
      }
    }

    // Lấy các product từ DB
    const prodIds = items.map(i => i.product);
    const products = await Product.find({ _id: { $in: prodIds } });

    const map = {};
    products.forEach(p => { map[p._id.toString()] = p; });

    // kiểm tra tồn tại & stock, tính tổng
    let total = 0;
    for (const it of items) {
      const p = map[it.product];
      if (!p) {
        return { EC: 4, EM: `Không tìm thấy product: ${it.product}`, DT: null };
      }
      if (p.stock < Number(it.quantity)) {
        return { EC: 5, EM: `Sản phẩm "${p.name}" không đủ tồn kho. Còn ${p.stock}`, DT: null };
      }
      total += p.price * Number(it.quantity);
    }

    // Tạo order
    const order = await Order.create({
      user: userId,
      items,
      totalPrice: total,
      address
    });

    // Giảm stock (lặp từng product)
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Number(it.quantity) } });
    }

    // Clear cart của user (nếu có)
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // Lấy lại order đã populate để trả về
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    return { EC: 0, EM: 'Tạo đơn hàng thành công', DT: populatedOrder };
  } catch (err) {
    console.error('createOrder error:', err);
    return { EC: -1, EM: 'Lỗi server khi tạo đơn hàng', DT: null };
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    return { EC: 0, EM: 'OK', DT: orders };
  } catch (err) {
    console.error('getOrdersByUser error:', err);
    return { EC: -1, EM: 'Lỗi server khi lấy đơn hàng', DT: null };
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    return { EC: 0, EM: 'OK', DT: orders };
  } catch (err) {
    console.error('getAllOrders error:', err);
    return { EC: -1, EM: 'Lỗi server khi lấy tất cả đơn', DT: null };
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const allowed = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return { EC: 1, EM: 'Trạng thái không hợp lệ', DT: null };
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('user', 'name email')
      .populate('items.product', 'name price image');
    if (!order) return { EC: 2, EM: 'Không tìm thấy đơn hàng', DT: null };
    return { EC: 0, EM: 'Cập nhật trạng thái thành công', DT: order };
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return { EC: -1, EM: 'Lỗi server khi cập nhật trạng thái', DT: null };
  }
};

module.exports = { createOrder, getOrdersByUser, getAllOrders, updateOrderStatus };
