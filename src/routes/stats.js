// src/routes/stats.js

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyJWT, requireRole } = require('../middleware/auth');

// Route này sẽ chỉ admin mới có quyền truy cập
router.get('/dashboard', verifyJWT, requireRole('admin'), statsController.getDashboardStats);

module.exports = router;