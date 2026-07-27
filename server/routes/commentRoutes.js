const express = require("express");

const {
  createComment,
  getCommentsByPost,
  getAllComments,
  approveComment,
  flagComment,
  rejectComment,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// CREATE COMMENT
// Logged-in Users
// ==========================================

router.post(
  "/",
  protect,
  createComment
);


// ==========================================
// GET COMMENTS FOR POST
// Public
// ==========================================

router.get(
  "/post/:postId",
  getCommentsByPost
);


// ==========================================
// MODERATION CONSOLE
// Editor / Admin
// ==========================================

// Get all comments
router.get(
  "/",
  protect,
  authorizeRoles("editor", "admin"),
  getAllComments
);


// Approve comment
router.put(
  "/:id/approve",
  protect,
  authorizeRoles("editor", "admin"),
  approveComment
);


// Flag comment
router.put(
  "/:id/flag",
  protect,
  authorizeRoles("editor", "admin"),
  flagComment
);


// Reject comment
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("editor", "admin"),
  rejectComment
);


// Delete comment
router.delete(
  "/:id",
  protect,
  authorizeRoles("editor", "admin"),
  deleteComment
);


module.exports = router;