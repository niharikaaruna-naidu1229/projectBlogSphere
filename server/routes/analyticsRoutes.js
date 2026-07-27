const express = require("express");

const {
  getOverallAnalytics,
  getTopPosts,
  getAuthorAnalytics,
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// OVERALL ANALYTICS
// Admin / Editor
// ==========================================
router.get(
  "/overview",
  protect,
  authorizeRoles("admin", "editor"),
  getOverallAnalytics
);


// ==========================================
// TOP PERFORMING POSTS
// Admin / Editor
// ==========================================
router.get(
  "/top-posts",
  protect,
  authorizeRoles("admin", "editor"),
  getTopPosts
);


// ==========================================
// AUTHOR ANALYTICS
// Author → Own analytics
// Editor / Admin → Overall analytics
// ==========================================
router.get(
  "/author",
  protect,
  authorizeRoles("author", "editor", "admin"),
  getAuthorAnalytics
);


module.exports = router;