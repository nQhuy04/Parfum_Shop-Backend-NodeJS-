const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyJWT, requireRole } = require('../middleware/auth');

// Public
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin
router.post('/', verifyJWT, requireRole('admin'), productController.createProduct);
router.put('/:id', verifyJWT, requireRole('admin'), productController.updateProduct);
router.delete('/:id', verifyJWT, requireRole('admin'), productController.deleteProduct);

module.exports = router;
