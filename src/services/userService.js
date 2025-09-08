require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

/**
 * Tạo user mới (Register)
 */
const createUserService = async (name, email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        EC: 1,
        EM: "Email đã tồn tại, vui lòng chọn email khác!",
        DT: null,
      };
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: "user",
    });

    return {
      EC: 0,
      EM: "Tạo tài khoản thành công!",
      DT: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.log(">>> createUserService error: ", error);
    return { EC: -1, EM: "Lỗi server khi tạo tài khoản", DT: null };
  }
};

/**
 * Đăng nhập
 */
const loginService = async (emailInput, password) => {
  try {
    const user = await User.findOne({ email: emailInput });
    if (!user) {
      return { EC: 1, EM: "Email hoặc mật khẩu không hợp lệ", DT: null };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return { EC: 2, EM: "Email hoặc mật khẩu không hợp lệ", DT: null };
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      EC: 0,
      EM: "Đăng nhập thành công!",
      DT: {
        access_token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.log(">>> loginService error: ", error);
    return { EC: -1, EM: "Lỗi server khi đăng nhập", DT: null };
  }
};

/**
 * Lấy danh sách user (Admin only)
 */
const getUserService = async () => {
  try {
    const users = await User.find({}).select("-password");
    return { EC: 0, EM: "Lấy danh sách user thành công!", DT: users };
  } catch (error) {
    console.log(">>> getUserService error: ", error);
    return { EC: -1, EM: "Lỗi server khi lấy danh sách user", DT: null };
  }
};

/**
 * User update profile
 */
const updateUserProfileService = async (userId, data) => {
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, saltRounds);
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-password");

    if (!user) return { EC: 1, EM: "Không tìm thấy user", DT: null };
    return { EC: 0, EM: "Cập nhật profile thành công", DT: user };
  } catch (error) {
    console.log(">>> updateUserProfileService error: ", error);
    return { EC: -1, EM: "Lỗi server khi update profile", DT: null };
  }
};

/**
 * Admin update role
 */
const updateUserRoleService = async (userId, role) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return { EC: 1, EM: "Không tìm thấy user", DT: null };
    return { EC: 0, EM: "Cập nhật role thành công", DT: user };
  } catch (error) {
    console.log(">>> updateUserRoleService error: ", error);
    return { EC: -1, EM: "Lỗi server khi update role", DT: null };
  }
};

/**
 * Admin delete user
 */
const deleteUserService = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return { EC: 1, EM: "Không tìm thấy user", DT: null };
    return { EC: 0, EM: "Xóa user thành công", DT: null };
  } catch (error) {
    console.log(">>> deleteUserService error: ", error);
    return { EC: -1, EM: "Lỗi server khi xóa user", DT: null };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  updateUserProfileService,
  updateUserRoleService,
  deleteUserService,
};
