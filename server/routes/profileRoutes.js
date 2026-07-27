const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getPublicationSettings,
  updatePublicationSettings,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PROFILE
// ==========================================

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.put("/me", protect, updateMyProfile);

// Change password
router.put("/change-password", protect, changePassword);


// ==========================================
// PUBLICATION SETTINGS
// ==========================================

// Get publication settings
router.get(
  "/publication-settings",
  protect,
  getPublicationSettings
);

// Update publication settings
router.put(
  "/publication-settings",
  protect,
  updatePublicationSettings
);

module.exports = router;