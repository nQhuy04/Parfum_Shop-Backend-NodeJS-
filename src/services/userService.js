require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

/**
 * Tạo user mới
 */
const createUserService = async (name, email, password) => {
  try {
    // Check email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        EC: 1,
        EM: "Email đã tồn tại, vui lòng chọn email khác!",
        DT: null,
      };
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Lưu user vào DB
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: "user", // mặc định là user
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
    return {
      EC: -1,
      EM: "Lỗi server khi tạo tài khoản",
      DT: null,
    };
  }
};

/**
 * Lấy danh sách user
 */
const getUserService = async () => {
  try {
    const users = await User.find({}).select("-password");
    return {
      EC: 0,
      EM: "Lấy danh sách user thành công!",
      DT: users,
    };
  } catch (error) {
    console.log(">>> getUserService error: ", error);
    return {
      EC: -1,
      EM: "Lỗi server khi lấy danh sách user",
      DT: null,
    };
  }
};

/**
 * Đăng nhập
 */
const loginService = async (emailInput, password) => {
  try {
    // Tìm user theo email
    const user = await User.findOne({ email: emailInput });
    if (!user) {
      return {
        EC: 1,
        EM: "Email hoặc mật khẩu không hợp lệ",
        DT: null,
      };
    }

    // Kiểm tra password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Email hoặc mật khẩu không hợp lệ",
        DT: null,
      };
    }

    // Tạo JWT token
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
    return {
      EC: -1,
      EM: "Lỗi server khi đăng nhập",
      DT: null,
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
};
