const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return res.status(200).json({ EC: 0, EM: "OK", DT: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: "Lỗi server khi lấy giỏ hàng", DT: null });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    return res.status(200).json({ EC: 0, EM: "Đã thêm vào giỏ hàng", DT: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: "Lỗi server khi thêm vào giỏ hàng", DT: null });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const cart = await cartService.updateItemQuantity(userId, productId, quantity);
    return res.status(200).json({ EC: 0, EM: "Đã cập nhật số lượng", DT: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: "Lỗi server khi cập nhật giỏ hàng", DT: null });
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cart = await cartService.removeItem(userId, productId);
    return res.status(200).json({ EC: 0, EM: "Đã xóa sản phẩm khỏi giỏ hàng", DT: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: "Lỗi server khi xóa sản phẩm", DT: null });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);
    return res.status(200).json({ EC: 0, EM: "Đã xóa toàn bộ giỏ hàng", DT: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ EC: -1, EM: "Lỗi server khi xóa giỏ hàng", DT: null });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  clearCart
};
