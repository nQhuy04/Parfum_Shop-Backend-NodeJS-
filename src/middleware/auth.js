// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   // Các route không cần auth
//   const white_lists = ["/", "/register", "/login"];

//   if (white_lists.includes(req.originalUrl.replace("/v1/api", ""))) {
//     return next();
//   }

//   const token = req?.headers?.authorization?.split(" ")?.[1];
//   if (!token) {
//     return res.status(401).json({
//       EC: 1,
//       EM: "Thiếu Access Token trong header",
//       DT: null,
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = {
//       email: decoded.email,
//       name: decoded.name,
//       createdBy: "HuyQuang",
//     };
//     console.log(">>> check token: ", decoded);
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       EC: 2,
//       EM: "Token không hợp lệ hoặc đã hết hạn",
//       DT: null,
//     });
//   }
// };

// module.exports = auth;

require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ EC: 1, EM: 'Thiếu Access Token trong header', DT: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should contain at least: { id, email, name, role, iat, exp }
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ EC: 2, EM: 'Token không hợp lệ hoặc đã hết hạn', DT: null });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ EC: 1, EM: 'Unauthorized', DT: null });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ EC: 1, EM: 'Bạn không có quyền thực hiện hành động này', DT: null });
    }
    return next();
  };
};

module.exports = { verifyJWT, requireRole };

