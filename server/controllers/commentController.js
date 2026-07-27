const Comment = require("../models/Comment");

// ==========================================
// CREATE COMMENT
// Logged-in User
// Automatic Moderation
// ==========================================
const createComment = async (req, res) => {
  try {
    const { content, post } = req.body;

    if (!content || !post) {
      return res.status(400).json({
        message: "Comment content and post ID are required",
      });
    }

    // Simple automated moderation filter
    const bannedWords = [
      "spam",
      "scam",
      "abuse",
      "hate",
      "idiot",
      "stupid",
    ];

    const lowerContent = content.toLowerCase();

    const detectedWord = bannedWords.find((word) =>
      lowerContent.includes(word)
    );

    let status = "approved";
    let flaggedReason = "";

    if (detectedWord) {
      status = "flagged";
      flaggedReason = `Inappropriate word detected: ${detectedWord}`;
    }

    const comment = await Comment.create({
      content,
      post,
      author: req.user.id,
      status,
      flaggedReason,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email role")
      .populate("post", "title");

    res.status(201).json({
      message: detectedWord
        ? "Comment created and flagged for moderation"
        : "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create comment",
      error: error.message,
    });
  }
};


// ==========================================
// GET COMMENTS FOR POST
// Public
// Only Approved Comments
// ==========================================
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      status: "approved",
    })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL COMMENTS
// Editor / Admin
// Moderation Console
// ==========================================
const getAllComments = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const comments = await Comment.find(filter)
      .populate("author", "name email role")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments fetched successfully",
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};


// ==========================================
// APPROVE COMMENT
// Editor / Admin
// ==========================================
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.status = "approved";
    comment.flaggedReason = "";

    await comment.save();

    res.status(200).json({
      message: "Comment approved successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve comment",
      error: error.message,
    });
  }
};


// ==========================================
// FLAG COMMENT
// Editor / Admin
// ==========================================
const flagComment = async (req, res) => {
  try {
    const { reason } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.status = "flagged";
    comment.flaggedReason =
      reason || "Comment flagged for moderation";

    await comment.save();

    res.status(200).json({
      message: "Comment flagged successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to flag comment",
      error: error.message,
    });
  }
};


// ==========================================
// REJECT COMMENT
// Editor / Admin
// ==========================================
const rejectComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.status = "rejected";

    await comment.save();

    res.status(200).json({
      message: "Comment rejected successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject comment",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE COMMENT
// Editor / Admin
// ==========================================
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};


module.exports = {
  createComment,
  getCommentsByPost,
  getAllComments,
  approveComment,
  flagComment,
  rejectComment,
  deleteComment,
};