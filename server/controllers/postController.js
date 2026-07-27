const Post = require("../models/Post");

// ==========================================
// CREATE POST
// Author / Editor / Admin
// ==========================================

const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      readTime,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    let coverImage = "";

    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    let postStatus = status || "draft";

    // Author cannot directly publish
    if (
      req.user.role === "author" &&
      postStatus === "published"
    ) {
      postStatus = "draft";
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status: postStatus,
      readTime: readTime || 1,
      author: req.user.id,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL POSTS
// PUBLIC
// SEARCH & FILTER
// ==========================================
const getAllPosts = async (req, res) => {
  try {
    const {
      search,
      tag,
      category,
      status,
      sort,
    } = req.query;

    // Build filter object
    const filter = {};

    // Search by title or content
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by tag
    if (tag) {
      filter.tags = {
        $in: [tag],
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "views") {
      sortOption = {
        views: -1,
      };
    }

    // Fetch posts
    const posts = await Post.find(filter)
      .populate("author", "name email role")
      .populate("category", "name description")
      .sort(sortOption);

    res.status(200).json({
      message: "Posts fetched successfully",
      count: posts.length,
      filters: {
        search: search || null,
        tag: tag || null,
        category: category || null,
        status: status || null,
        sort: sort || "latest",
      },
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE POST
// Public
// Increase Views
// ==========================================
const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    )
      .populate("author", "name email role")
      .populate("category", "name description");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE POST
// Author → Own Posts
// Editor/Admin → Any Post
// ==========================================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Author can update only own post
    if (
      req.user.role === "author" &&
      post.author.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Authors can only update their own posts",
      });
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      readTime,
    } = req.body;

    // Author cannot directly publish
    if (
      req.user.role === "author" &&
      status === "published"
    ) {
      return res.status(403).json({
        message:
          "Authors cannot publish posts directly. Submit the post for editor approval.",
      });
    }

    if (req.file) {
      post.coverImage = `/uploads/${req.file.filename}`;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.status = status || post.status;
    post.readTime = readTime || post.readTime;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE POST
// Author → Own Posts
// Editor/Admin → Any Post
// ==========================================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      req.user.role === "author" &&
      post.author.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Authors can only delete their own posts",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};


// ==========================================
// SUBMIT POST FOR REVIEW
// Author → Own Post
// Draft → Pending
// ==========================================
const submitPostForReview = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only submit your own posts",
      });
    }

    if (post.status !== "draft") {
      return res.status(400).json({
        message: "Only draft posts can be submitted for review",
      });
    }

    post.status = "pending";

    await post.save();

    res.status(200).json({
      message: "Post submitted for editor review",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit post for review",
      error: error.message,
    });
  }
};


// ==========================================
// APPROVE / PUBLISH POST
// Editor / Admin
// ==========================================
const publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      req.user.role !== "editor" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only editors and admins can publish posts",
      });
    }

    post.status = "published";

    await post.save();

    res.status(200).json({
      message: "Post approved and published successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to publish post",
      error: error.message,
    });
  }
};


// ==========================================
// REJECT POST
// Editor / Admin
// Pending → Draft
// ==========================================
const rejectPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      req.user.role !== "editor" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Only editors and admins can reject posts",
      });
    }

    post.status = "draft";

    await post.save();

    res.status(200).json({
      message: "Post rejected and moved back to draft",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject post",
      error: error.message,
    });
  }
};


// ==========================================
// GET POST ANALYTICS
// Editor / Admin
// ==========================================
const getPostAnalytics = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("category", "name");

    const totalPosts = posts.length;

    const publishedPosts = posts.filter(
      (post) => post.status === "published"
    ).length;

    const draftPosts = posts.filter(
      (post) => post.status === "draft"
    ).length;

    const pendingPosts = posts.filter(
      (post) => post.status === "pending"
    ).length;

    const rejectedPosts = posts.filter(
      (post) => post.status === "rejected"
    ).length;

    const totalViews = posts.reduce(
      (total, post) => total + (post.views || 0),
      0
    );

    const totalReadTime = posts.reduce(
      (total, post) => total + (post.readTime || 0),
      0
    );

    const averageReadTime =
      totalPosts > 0
        ? (totalReadTime / totalPosts).toFixed(2)
        : 0;

    const topPosts = [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((post) => ({
        id: post._id,
        title: post.title,
        views: post.views,
        readTime: post.readTime,
        status: post.status,
        author: post.author,
        category: post.category,
      }));

    res.status(200).json({
      message: "Analytics fetched successfully",

      analytics: {
        totalPosts,
        publishedPosts,
        draftPosts,
        pendingPosts,
        rejectedPosts,
        totalViews,
        totalReadTime,
        averageReadTime,
      },

      topPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  submitPostForReview,
  publishPost,
  rejectPost,
  getPostAnalytics,
};