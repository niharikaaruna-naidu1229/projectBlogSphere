const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ==========================================
// GET MY PROFILE
// ==========================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================
const updateMyProfile = async (req, res) => {
  try {
    const { name, email, profileImage, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    // Check email already belongs to another user
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already registered by another user",
        });
      }

      user.email = email.toLowerCase();
    }

    if (name) {
      user.name = name;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        publicationSettings: user.publicationSettings,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};


// ==========================================
// GET PUBLICATION SETTINGS
// ==========================================
const getPublicationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "publicationSettings"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Publication settings fetched successfully",
      settings: user.publicationSettings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch publication settings",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PUBLICATION SETTINGS
// ==========================================
const updatePublicationSettings = async (req, res) => {
  try {
    const {
      displayName,
      defaultPostStatus,
      allowComments,
      showProfile,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (displayName !== undefined) {
      user.publicationSettings.displayName = displayName;
    }

    if (defaultPostStatus !== undefined) {
      if (!["draft", "pending"].includes(defaultPostStatus)) {
        return res.status(400).json({
          message:
            "Default post status must be draft or pending",
        });
      }

      user.publicationSettings.defaultPostStatus =
        defaultPostStatus;
    }

    if (allowComments !== undefined) {
      user.publicationSettings.allowComments = allowComments;
    }

    if (showProfile !== undefined) {
      user.publicationSettings.showProfile = showProfile;
    }

    await user.save();

    res.status(200).json({
      message: "Publication settings updated successfully",
      settings: user.publicationSettings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update publication settings",
      error: error.message,
    });
  }
};


module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getPublicationSettings,
  updatePublicationSettings,
};
