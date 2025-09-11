// src/controllers/orderController.js
const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  // 1. Lấy userId một cách an toàn
  const userId = req.user && (req.user.id || req.user._id);

  // 2. THÊM LỚP BẢO VỆ QUAN TRỌNG NHẤT
  // Nếu không tìm thấy userId (do token không hợp lệ hoặc thiếu), trả về lỗi ngay lập tức.
  if (!userId) {
    return res.status(401).json({ EC: -1, EM: 'Unauthorized - Vui lòng đăng nhập lại.', DT: null });
  }

  // Nếu đã có userId, logic cũ vẫn chính xác
  const { items, shippingAddress } = req.body; 

  const result = await orderService.createOrder({ userId, items, shippingAddress });
  return res.status(result.EC === 0 ? 201 : 400).json(result);
};

const myOrders = async (req, res) => {
  const userId = req.user && (req.user.id || req.user._id);
  
  if (!userId) {
    return res.status(401).json({ EC: -1, EM: 'Unauthorized - Vui lòng đăng nhập lại.', DT: null });
  }
  
  const result = await orderService.getOrdersByUser(userId);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const listOrders = async (req, res) => {
  const result = await orderService.getAllOrders();
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const result = await orderService.updateOrderStatus(req.params.id, status);
  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = { createOrder, myOrders, listOrders, updateStatus };