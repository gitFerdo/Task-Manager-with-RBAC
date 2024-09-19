const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all users (Admin only)
router.get("/all", authMiddleware(["admin"]), async (req, res) => {
  console.log("Received GET /all request");
  try {
    const users = await User.find().populate("team", "name");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
});

// Get a single user (Admin only)
router.get("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("team", "name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new user (Admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { username, password, role, team } = req.body;

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
      team: team || null, // Assign team if provided
    });

    // Save user to the database
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user" });
  }
});

// Update a user (Admin only)
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { username, password, role, team } = req.body;

    // Validate role if provided
    if (role && !["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Find the user to update
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (username) user.username = username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (role) user.role = role;
    if (team !== undefined) user.team = team;

    // Save the updated user
    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user" });
  }
});

// Delete a user (Admin only)
router.delete("/delete/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user" });
  }
});

module.exports = router;
