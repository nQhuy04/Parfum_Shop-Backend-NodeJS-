const Product = require('../models/product');

/**
 * Create product
 * data: { name, description, price, image, stock, category }
 */
const createProduct = async (data) => {
  try {
    const p = await Product.create(data);
    return { EC: 0, EM: 'Tạo sản phẩm thành công', DT: p };
  } catch (error) {
    console.error('>>> createProduct error:', error);
    return { EC: -1, EM: 'Lỗi server khi tạo product', DT: null };
  }
};

const findProducts = async (filter = {}) => {
  try {
    const items = await Product.find(filter).sort({ createdAt: -1 });
    return { EC: 0, EM: 'Lấy danh sách sản phẩm thành công', DT: items };
  } catch (error) {
    console.error('>>> findProducts error:', error);
    return { EC: -1, EM: 'Lỗi server khi lấy sản phẩm', DT: null };
  }
};

const findProductById = async (id) => {
  try {
    const p = await Product.findById(id);
    if (!p) return { EC: 1, EM: 'Không tìm thấy sản phẩm', DT: null };
    return { EC: 0, EM: 'OK', DT: p };
  } catch (error) {
    console.error('>>> findProductById error:', error);
    return { EC: -1, EM: 'Lỗi server khi lấy product', DT: null };
  }
};

const updateProductById = async (id, data) => {
  try {
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return { EC: 1, EM: 'Không tìm thấy sản phẩm để cập nhật', DT: null };
    return { EC: 0, EM: 'Cập nhật sản phẩm thành công', DT: updated };
  } catch (error) {
    console.error('>>> updateProductById error:', error);
    return { EC: -1, EM: 'Lỗi server khi cập nhật product', DT: null };
  }
};

const deleteProductById = async (id) => {
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return { EC: 1, EM: 'Không tìm thấy sản phẩm để xóa', DT: null };
    return { EC: 0, EM: 'Xóa sản phẩm thành công', DT: deleted };
  } catch (error) {
    console.error('>>> deleteProductById error:', error);
    return { EC: -1, EM: 'Lỗi server khi xóa product', DT: null };
  }
};

module.exports = {
  createProduct,
  findProducts,
  findProductById,
  updateProductById,
  deleteProductById,
};
