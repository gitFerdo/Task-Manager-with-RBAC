const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    default: "employee",
    enum: ["admin", "manager", "employee"],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
});

module.exports = mongoose.model("User", userSchema);
