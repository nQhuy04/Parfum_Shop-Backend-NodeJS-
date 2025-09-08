// const express = require("express");
// const {
//   createUser,
//   handleLogin,
//   getUser,
//   getAccount,
// } = require("../controllers/userController");
// const auth = require("../middleware/auth");

// const routerAPI = express.Router();

// // Áp dụng middleware auth cho tất cả route
// routerAPI.all("*", auth);

// // Routes
// routerAPI.get("/", (req, res) => res.status(200).json("Hello world api"));
// routerAPI.post("/register", createUser);
// routerAPI.post("/login", handleLogin);
// routerAPI.get("/user", getUser);
// routerAPI.get("/account", getAccount);

// module.exports = routerAPI;

const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const productRoutes = require('./product');
const { verifyJWT } = require('../middleware/auth');
const orderRoutes = require('./order');

const routerAPI = express.Router();

// Public
routerAPI.get('/', (req, res) => res.status(200).json('Hello world api'));
routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

// Mount product routes
routerAPI.use('/products', productRoutes);

// Protected user endpoints
routerAPI.get('/user', verifyJWT, getUser);
routerAPI.get('/account', verifyJWT, getAccount);
//Order
routerAPI.use('/orders', orderRoutes);


module.exports = routerAPI;

