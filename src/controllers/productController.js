const productService = require('../services/productService');

/** GET /v1/api/products */
const listProducts = async (req, res) => {
  const q = req.query || {};
  // Note: we keep it simple. Frontend can add query params later (search, category, price...)
  const result = await productService.findProducts(q);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

/** GET /v1/api/products/:id */
const getProduct = async (req, res) => {
  const result = await productService.findProductById(req.params.id);
  return res.status(result.EC === 0 ? 200 : (result.EC === 1 ? 404 : 500)).json(result);
};

/** POST /v1/api/products (admin) */
const createProduct = async (req, res) => {
  // === THAY ĐỔI Ở ĐÂY: Nâng cấp validation ===
  const { name, price, brand, gender } = req.body;
  // Kiểm tra tất cả các trường bắt buộc
  if (!name || price == null || !brand || !gender) {
    return res.status(400).json({ EC: 1, EM: 'Thiếu các trường bắt buộc: name, price, brand, gender', DT: null });
  }
  const result = await productService.createProduct(req.body);
  return res.status(result.EC === 0 ? 201 : 500).json(result);
};

/** PUT /v1/api/products/:id (admin) */
const updateProduct = async (req, res) => {
  // Hàm này không cần thay đổi vì service đã xử lý linh hoạt
  const result = await productService.updateProductById(req.params.id, req.body);
  return res.status(result.EC === 0 ? 200 : (result.EC === 1 ? 404 : 500)).json(result);
};

/** DELETE /v1/api/products/:id (admin) */
const deleteProduct = async (req, res) => {
  const result = await productService.deleteProductById(req.params.id);
  return res.status(result.EC === 0 ? 200 : (result.EC === 1 ? 404 : 500)).json(result);
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};