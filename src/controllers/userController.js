const {
  createUserService,
  loginService,
  getUserService,
  updateUserProfileService,
  updateUserRoleService,
  deleteUserService,
} = require("../services/userService");

/**
 * Đăng ký user
 */
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      EC: 1,
      EM: "Vui lòng nhập đầy đủ name, email, password",
      DT: null,
    });
  }
  return res.status(200).json(await createUserService(name, email, password));
};

/**
 * Đăng nhập
 */
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      EC: 1,
      EM: "Vui lòng nhập đầy đủ email và password",
      DT: null,
    });
  }
  return res.status(200).json(await loginService(email, password));
};

/**
 * Lấy danh sách user (Admin only)
 */
const getUser = async (req, res) => {
  return res.status(200).json(await getUserService());
};

/**
 * Lấy account từ token
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
 * User update profile
 */
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  return res.status(200).json(await updateUserProfileService(userId, req.body));
};

/**
 * Admin update role
 */
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  return res.status(200).json(await updateUserRoleService(id, role));
};

/**
 * Admin delete user
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;
  return res.status(200).json(await deleteUserService(id));
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  updateUserProfile,
  updateUserRole,
  deleteUser,
};
