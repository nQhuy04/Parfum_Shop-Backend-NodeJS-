// src/controllers/statsController.js

const statsService = require('../services/statsService');

const getDashboardStats = async (req, res) => {
    const result = await statsService.getDashboardStats();
    // Kiểm tra xem service có trả về lỗi không
    if (result.EC !== 0) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
};

module.exports = { getDashboardStats };