const Cart = require("../models/cart");

const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

const addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  return await cart.save();
};

const updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Giỏ hàng không tồn tại");

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    return await cart.save();
  }
  throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
};

const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Giỏ hàng không tồn tại");

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  return await cart.save();
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Giỏ hàng không tồn tại");

  cart.items = [];
  return await cart.save();
};

module.exports = {
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  clearCart
};
