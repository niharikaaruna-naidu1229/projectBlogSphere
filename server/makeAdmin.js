const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const user = await User.findOneAndUpdate(
      { email: "niharika123@gmail.com" },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    console.log("User role updated successfully!");
    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to update user role:");
    console.error(error.message);
    process.exit(1);
  }
};

makeAdmin();