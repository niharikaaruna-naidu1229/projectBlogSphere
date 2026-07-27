const express = require("express");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  submitPostForReview,
  publishPost,
  rejectPost,
  getPostAnalytics,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get("/", getAllPosts);


// ==========================================
// ANALYTICS
// Must be BEFORE /:id
// Editor / Admin Only
// ==========================================

router.get(
  "/analytics/dashboard",
  protect,
  authorizeRoles("editor", "admin"),
  getPostAnalytics
);


// ==========================================
// GET SINGLE POST
// Public
// ==========================================

router.get("/:id", getPostById);


// ==========================================
// CREATE POST
// Author / Editor / Admin
// ==========================================

router.post(
  "/",
  protect,
  upload.single("coverImage"),
  createPost
);


// ==========================================
// UPDATE POST
// Author → Own Post
// Editor/Admin → Any Post
// ==========================================

router.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  updatePost
);


// ==========================================
// DELETE POST
// Author → Own Post
// Editor/Admin → Any Post
// ==========================================

router.delete(
  "/:id",
  protect,
  deletePost
);


// ==========================================
// AUTHOR → SUBMIT FOR REVIEW
// ==========================================

router.put(
  "/:id/submit",
  protect,
  authorizeRoles("author"),
  submitPostForReview
);


// ==========================================
// EDITOR / ADMIN → PUBLISH
// ==========================================

router.put(
  "/:id/publish",
  protect,
  authorizeRoles("editor", "admin"),
  publishPost
);


// ==========================================
// EDITOR / ADMIN → REJECT
// ==========================================

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("editor", "admin"),
  rejectPost
);


module.exports = router;