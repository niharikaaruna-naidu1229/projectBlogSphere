const express = require("express");
const cors = require("cors");

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================
app.use(
  cors({
    origin: [
      "https://project-blog-sphere-btb3.vercel.app",
      "https://project-blog-sphere-btb3-8scc0aoq1.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ==========================================
// BODY PARSER
// ==========================================
app.use(express.json());


// ==========================================
// SERVE UPLOADED IMAGES
// ==========================================
app.use("/uploads", express.static("uploads"));


// ==========================================
// AUTH ROUTES
// ==========================================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// ==========================================
// PROFILE ROUTES
// ==========================================
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);


// ==========================================
// POST ROUTES
// ==========================================
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);


// ==========================================
// CATEGORY ROUTES
// ==========================================
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);


// ==========================================
// COMMENT ROUTES
// ==========================================
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);


// ==========================================
// ANALYTICS ROUTES
// ==========================================
const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);


// ==========================================
// USER MANAGEMENT ROUTES
// Admin: View users, change roles, delete users
// ==========================================
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);


// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "BlogSphere API is running successfully!",
  });
});


// ==========================================
// 404 ROUTE
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ==========================================
// ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});


module.exports = app;