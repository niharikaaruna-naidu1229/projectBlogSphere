const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);