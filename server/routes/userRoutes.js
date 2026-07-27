const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);

router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;