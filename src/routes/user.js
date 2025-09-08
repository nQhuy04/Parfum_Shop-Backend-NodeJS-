
const express = require("express");
const {
  getUser,
  getAccount,
  updateUserProfile,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { verifyJWT, requireRole } = require("../middleware/auth");

const router = express.Router();

// User (self)
router.get("/account", verifyJWT, getAccount);         // GET /v1/api/users/account
router.patch("/me", verifyJWT, updateUserProfile);     // PATCH /v1/api/users/me

// Admin
router.get("/", verifyJWT, requireRole("admin"), getUser);            // GET /v1/api/users
router.patch("/:id/role", verifyJWT, requireRole("admin"), updateUserRole); // PATCH /v1/api/users/:id/role
router.delete("/:id", verifyJWT, requireRole("admin"), deleteUser);   // DELETE /v1/api/users/:id

module.exports = router;
