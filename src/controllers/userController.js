const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService");

/**
 * Đăng ký user
 */
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra thiếu input
  if (!name || !email || !password) {
    return res.status(400).json({
      EC: 1,
      EM: "Vui lòng nhập đầy đủ name, email, password",
      DT: null,
    });
  }

  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

/**
 * Lấy danh sách user
 */
const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

/**
 * Lấy thông tin account từ token (req.user do middleware gán vào)
 */
const getAccount = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      EC: 1,
      EM: "Token không hợp lệ hoặc đã hết hạn",
      DT: null,
    });
  }
  return res.status(200).json({
    EC: 0,
    EM: "Lấy thông tin account thành công",
    DT: req.user,
  });
};

/**
 * Đăng nhập
 */
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      EC: 1,
      EM: "Vui lòng nhập đầy đủ email và password",
      DT: null,
    });
  }

  const data = await loginService(email, password);
  return res.status(200).json(data);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};
