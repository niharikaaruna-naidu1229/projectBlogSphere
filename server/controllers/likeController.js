const Like = require("../models/Like");

// LIKE POST
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existingLike = await Like.findOne({
      post: postId,
      user: req.user.id,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "You already liked this post",
      });
    }

    const like = await Like.create({
      post: postId,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to like post",
      error: error.message,
    });
  }
};

// UNLIKE POST
const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const like = await Like.findOneAndDelete({
      post: postId,
      user: req.user.id,
    });

    if (!like) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    res.status(200).json({
      message: "Post unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to unlike post",
      error: error.message,
    });
  }
};

// GET LIKE COUNT
const getLikeCount = async (req, res) => {
  try {
    const count = await Like.countDocuments({
      post: req.params.postId,
    });

    res.status(200).json({
      message: "Like count fetched successfully",
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch like count",
      error: error.message,
    });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getLikeCount,
};