const Post = require("../models/Post");

// ==========================================
// GET OVERALL ANALYTICS
// Admin / Editor
// ==========================================
const getOverallAnalytics = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();

    const publishedPosts = await Post.countDocuments({
      status: "published",
    });

    const draftPosts = await Post.countDocuments({
      status: "draft",
    });

    const pendingPosts = await Post.countDocuments({
      status: "pending",
    });

    const totalViewsResult = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const totalViews =
      totalViewsResult.length > 0
        ? totalViewsResult[0].totalViews
        : 0;

    const averageReadTimeResult = await Post.aggregate([
      {
        $group: {
          _id: null,
          averageReadTime: { $avg: "$readTime" },
        },
      },
    ]);

    const averageReadTime =
      averageReadTimeResult.length > 0
        ? Number(
            averageReadTimeResult[0].averageReadTime.toFixed(2)
          )
        : 0;

    res.status(200).json({
      message: "Analytics fetched successfully",
      analytics: {
        totalPosts,
        publishedPosts,
        draftPosts,
        pendingPosts,
        totalViews,
        averageReadTime,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};


// ==========================================
// GET TOP POSTS
// Admin / Editor
// ==========================================
const getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
    })
      .populate("author", "name email")
      .sort({ views: -1 })
      .limit(10);

    res.status(200).json({
      message: "Top posts fetched successfully",
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch top posts",
      error: error.message,
    });
  }
};


// ==========================================
// GET AUTHOR ANALYTICS
// Author → Own posts
// Editor / Admin → All posts
// ==========================================
const getAuthorAnalytics = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "author") {
      filter.author = req.user.id;
    }

    const posts = await Post.find(filter)
      .select(
        "title status views readTime createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    const totalPosts = posts.length;

    const totalViews = posts.reduce(
      (total, post) => total + post.views,
      0
    );

    const averageReadTime =
      totalPosts > 0
        ? Number(
            (
              posts.reduce(
                (total, post) => total + post.readTime,
                0
              ) / totalPosts
            ).toFixed(2)
          )
        : 0;

    res.status(200).json({
      message: "Author analytics fetched successfully",
      analytics: {
        totalPosts,
        totalViews,
        averageReadTime,
        posts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch author analytics",
      error: error.message,
    });
  }
};


module.exports = {
  getOverallAnalytics,
  getTopPosts,
  getAuthorAnalytics,
};