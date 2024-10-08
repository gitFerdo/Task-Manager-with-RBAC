const express = require("express");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const Team = require("../model/Team");
const User = require("../model/User");

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new team
router.post("/teams", auth(["admin"]), async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = new Team({
      name,
      members,
      createdBy: req.user._id,
    });

    await team.save();

    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $set: { team: team._id } }
      );
    }

    res.status(201).json(team);
  } catch (err) {
    console.error("Error creating team:", err);
    res
      .status(500)
      .json({ message: "An error occurred while creating the team" });
  }
});

// Add or remove members from a team
router.patch("/teams/:id/members", auth(["admin"]), async (req, res) => {
  try {
    const { addMembers, removeMembers } = req.body;
    const teamId = req.params.id;

    if (!teamId || !isValidObjectId(teamId)) {
      return res.status(400).json({ message: "Invalid Team ID" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (addMembers && !addMembers.every(isValidObjectId)) {
      return res.status(400).json({ message: "Invalid member IDs" });
    }

    if (removeMembers && !removeMembers.every(isValidObjectId)) {
      return res.status(400).json({ message: "Invalid member IDs" });
    }

    if (addMembers && addMembers.length > 0) {
      team.members.push(...addMembers);
      await User.updateMany(
        { _id: { $in: addMembers } },
        { $set: { team: team._id } }
      );
    }

    if (removeMembers && removeMembers.length > 0) {
      team.members = team.members.filter(
        (member) => !removeMembers.includes(member.toString())
      );
      await User.updateMany(
        { _id: { $in: removeMembers } },
        { $unset: { team: "" } }
      );
    }

    await team.save();
    res.status(200).json(team);
  } catch (err) {
    console.error("Error updating team members:", err);
    res
      .status(500)
      .json({ message: "An error occurred while updating team members" });
  }
});

// Get all teams
router.get("/all", auth(["admin", "manager"]), async (req, res) => {
  console.log("Received GET /all request");
  try {
    const teams = await Team.find().populate("members", "username role");
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
});

// Get all members of a specific team
router.get("/:id/members", auth(["admin", "manager"]), async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId).populate(
      "members",
      "username role"
    );
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(team.members);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team members" });
  }
});

// Delete a team
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    await User.updateMany({ team: teamId }, { $unset: { team: "" } });

    await Team.deleteOne({ _id: teamId });

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Error deleting team:", err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the team" });
  }
});

module.exports = router;
