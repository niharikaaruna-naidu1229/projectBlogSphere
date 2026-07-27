const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC PROFILE
    // ==========================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ==========================================
    // USER ROLE
    // ==========================================
    role: {
      type: String,
      enum: ["author", "editor", "admin"],
      default: "author",
    },

    // ==========================================
    // PROFILE IMAGE
    // ==========================================
    profileImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // PROFILE BIO
    // ==========================================
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // ==========================================
    // PUBLICATION SETTINGS
    // ==========================================
    publicationSettings: {
      displayName: {
        type: String,
        default: "",
        trim: true,
      },

      defaultPostStatus: {
        type: String,
        enum: ["draft", "pending"],
        default: "draft",
      },

      allowComments: {
        type: Boolean,
        default: true,
      },

      showProfile: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);