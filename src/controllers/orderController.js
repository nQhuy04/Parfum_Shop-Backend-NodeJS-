const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  const userId = req.user && (req.user.id || req.user._id);
  const { items, address } = req.body;
  const result = await orderService.createOrder({ userId, items, address });
  return res.status(result.EC === 0 ? 201 : 400).json(result);
};

const myOrders = async (req, res) => {
  const userId = req.user && (req.user.id || req.user._id);
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
