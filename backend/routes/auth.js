const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import model
const User = require("../model/User");

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate role
    if (!["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

module.exports = router;
