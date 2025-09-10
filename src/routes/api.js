// src/routes/api.js
const express = require("express");
const { createUser, handleLogin } = require("../controllers/userController");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const userRoutes = require("./user");
const {
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { verifyJWT } = require("../middleware/auth");

const routerAPI = express.Router();

// Public
routerAPI.get("/", (req, res) => res.status(200).json(""));
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Mount routes
routerAPI.use("/products", productRoutes);
routerAPI.use("/orders", orderRoutes);
routerAPI.use("/users", userRoutes); // tất cả user API nằm ở đây

// Cart routes (user must login)
routerAPI.get("/cart", verifyJWT, getCart);
routerAPI.post("/cart", verifyJWT, addToCart);
routerAPI.put("/cart", verifyJWT, updateItemQuantity);
routerAPI.delete("/cart/:productId", verifyJWT, removeItem);
routerAPI.delete("/cart", verifyJWT, clearCart);

module.exports = routerAPI;
