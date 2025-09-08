const express = require('express');
const router = express.Router();
const { createOrder, myOrders, listOrders, updateStatus } = require('../controllers/orderController');
const { verifyJWT, requireRole } = require('../middleware/auth');

router.post('/', verifyJWT, createOrder);          // create order by logged user
router.get('/me', verifyJWT, myOrders);            // get my orders
router.get('/', verifyJWT, requireRole('admin'), listOrders); // admin: all orders
router.patch('/:id/status', verifyJWT, requireRole('admin'), updateStatus); // admin update status

module.exports = router;
