const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../model/Task");
const User = require("../model/User");

const router = express.Router();

// Create a task
router.post("/tasks", auth(["admin", "manager"]), async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const user = req.user;

    if (user.role === "manager") {
      const manager = await User.findById(user._id).populate("team");
      if (!manager.team.members.includes(assignedTo)) {
        return res
          .status(403)
          .json({ message: "Not authorized to assign tasks to this user" });
      }
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update a task
router.put("/tasks/:id", auth(["admin", "manager"]), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Update task status (for employees)
router.patch("/tasks/:id/status", auth("employee"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.status = req.body.status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task status" });
  }
});

// Get tasks
router.get(
  "/tasks",
  auth(["admin", "manager", "employee"]),
  async (req, res) => {
    try {
      const user = req.user;
      let tasks;

      if (user.role === "admin") {
        tasks = await Task.find()
          .populate("assignedTo", "username")
          .populate("createdBy", "username");
      } else if (user.role === "manager") {
        const manager = await User.findById(user._id).populate("team");
        tasks = await Task.find({ createdBy: user._id }).or([
          { assignedTo: { $in: manager.team.members } },
        ]);
      } else if (user.role === "employee") {
        tasks = await Task.find({ assignedTo: user._id });
      }

      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Error fetching tasks" });
    }
  }
);

// Delete a task
router.delete("/tasks/:id", auth(["admin", "manager"]), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
