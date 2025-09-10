// src/services/orderService.js
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const mongoose = require('mongoose');

const createOrder = async ({ userId, items, shippingAddress }) => {
  try {
    // 1. Validation input mới: Kiểm tra cả object shippingAddress
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
        return { EC: 6, EM: 'Vui lòng cung cấp đầy đủ thông tin giao hàng (tên, sđt, địa chỉ)', DT: null };
    }
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

    const productMap = {};
    products.forEach(p => { productMap[p._id.toString()] = p; });

    let totalAmount = 0;
    const itemsWithPrice = []; // Mảng mới để lưu thông tin item hoàn chỉnh

    // 2. Lặp qua items để kiểm tra stock, tính tổng VÀ lưu lại giá
    for (const it of items) {
      const productDetails = productMap[it.product];
      if (!productDetails) {
        return { EC: 4, EM: `Không tìm thấy product: ${it.product}`, DT: null };
      }
      if (productDetails.stock < Number(it.quantity)) {
        return { EC: 5, EM: `Sản phẩm "${productDetails.name}" không đủ tồn kho. Còn ${productDetails.stock}`, DT: null };
      }
      
      const priceAtOrderTime = productDetails.price;
      totalAmount += priceAtOrderTime * Number(it.quantity);

      itemsWithPrice.push({
        product: it.product,
        quantity: it.quantity,
        price: priceAtOrderTime // <<< Ghi lại giá sản phẩm vào đơn hàng
      });
    }

    // 3. Tạo order với cấu trúc dữ liệu mới
    const order = await Order.create({
      user: userId,
      items: itemsWithPrice,          // Dùng mảng items đã có giá
      totalAmount: totalAmount,       // Đổi tên thành totalAmount cho khớp Model
      shippingAddress: shippingAddress // Lưu cả object địa chỉ
    });

    // 4. Giảm stock (không đổi)
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Number(it.quantity) } });
    }

    // 5. Clear cart của user (không đổi)
    await Cart.findOneAndRemove({ user: userId }); // Dùng findOneAndRemove để xóa hẳn cart

    // 6. Lấy lại order đã populate để trả về (không đổi)
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name image'); // Không cần populate lại price, vì đã lưu trong item

    return { EC: 0, EM: 'Tạo đơn hàng thành công', DT: populatedOrder };
  } catch (err) {
    console.error('createOrder error:', err);
    return { EC: -1, EM: 'Lỗi server khi tạo đơn hàng', DT: null };
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name image') // Chỉ cần lấy name và image
      .sort({ createdAt: -1 });
    return { EC: 0, EM: 'OK', DT: orders };
  } catch (err) {
    console.error('getOrdersByUser error:', err);
    return { EC: -1, EM: 'Lỗi server khi lấy đơn hàng', DT: null };
  }
};

const getAllOrders = async (userId) => { // userId để populate tên user
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name image')
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
      .populate('items.product', 'name image');
      
    if (!order) return { EC: 2, EM: 'Không tìm thấy đơn hàng', DT: null };
    return { EC: 0, EM: 'Cập nhật trạng thái thành công', DT: order };
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return { EC: -1, EM: 'Lỗi server khi cập nhật trạng thái', DT: null };
  }
};

module.exports = { createOrder, getOrdersByUser, getAllOrders, updateOrderStatus };