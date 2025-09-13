// src/services/statsService.js

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

const getDashboardStats = async () => {
    try {
        // === 1. Lấy các số liệu đơn giản bằng countDocuments ===
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // === 2. Lấy Tổng Doanh thu bằng MongoDB Aggregation (kỹ năng xịn) ===
        // Chúng ta chỉ tính doanh thu từ các đơn hàng đã 'hoàn thành'
        const revenuePipeline = [
            {
                $match: { status: 'completed' } // Chỉ lấy các đơn hàng đã hoàn thành
            },
            {
                // Gom tất cả các đơn hàng tìm thấy vào một nhóm duy nhất
                $group: {
                    _id: null, // Nhóm tất cả lại
                    total: { $sum: '$totalAmount' } // Tính tổng của trường 'totalAmount'
                }
            }
        ];
        const revenueResult = await Order.aggregate(revenuePipeline);
        
        // revenueResult sẽ là một mảng, ví dụ: [{ _id: null, total: 150000000 }]
        // Nếu không có đơn hàng nào hoàn thành, mảng sẽ rỗng.
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        
        // (Bạn có thể thêm logic lấy sản phẩm bán chạy nhất ở đây sau)

        // === 3. Trả về kết quả ===
        return {
            EC: 0,
            EM: 'Lấy dữ liệu dashboard thành công',
            DT: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        };

    } catch (error) {
        console.error('getDashboardStats error:', error);
        return { EC: -1, EM: 'Lỗi server khi lấy dữ liệu dashboard', DT: null };
    }
};

module.exports = { getDashboardStats };