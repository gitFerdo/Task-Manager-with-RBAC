const express = require("express");

const auth = require("../middleware/auth");
const Task = require("../model/Task");

const router = express.Router();

// Create Tasks
router.post("/task", auth(["admin", "manager"]), async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    // Create a new task
    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.userId,
    });

    // Save the task to the database
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error("Error during creating new Task:", err);

    return res
      .status(500)
      .json({ message: "An error during creating new Task" });
  }
});

// Update Tasks - Admin && Manager
router.put("/:id", auth(["admin", "manager"]), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // only admin and manager are allowed to update tasks
    if (
      task.createdBy.toString() !== req.user.userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this task" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error during updating Task:", err);

    return res.status(500).json({ message: "An error during updating Task" });
  }
});

// Update Task Status - Employee
router.patch("/:id/status", auth(["employee"]), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // only employee can update tasks assigned to them
    if (task.assignedTo.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update tasks assigned to you" });
    }

    task.status = req.body.status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error during updating Task status:", err);

    return res
      .status(500)
      .json({ message: "An error during updating Task status" });
  }
});

// Get all tasks
router.get(
  "/tasks",
  auth(["admin", "manager", "employee"]),
  async (req, res) => {
    try {
      let tasks;
      const user = req.user;

      // Admins can see all tasks
      if (user.role === "admin") {
        tasks = await Task.find()
          .populate("assignedTo", "name email")
          .populate("createdBy", "name email");
      }
      // Managers can see tasks created by them or assigned to their team
      else if (user.role === "manager") {
        tasks = await Task.find({ createdBy: user.userId }).populate(
          "assignedTo",
          "name email"
        );
      }
      // Employees can only see tasks assigned to them
      else if (user.role === "employee") {
        tasks = await Task.find({ assignedTo: user.userId });
      }

      res.status(200).json(tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching tasks" });
    }
  }
);

// Delete Task
router.delete("/:id", auth(["admin", "manager"]), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only admin or manager who created the task or belongs to the same manager can delete
    if (
      (task.createdBy.toString() !== req.user.userId.toString() &&
        req.user.role !== "admin") ||
      (req.user.role === "manager" &&
        task.createdBy.toString() !== req.user.userId.toString())
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this task" });
    }

    // Delete the task
    await task.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error during deleting Task:", err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the task" });
  }
});

module.exports = router;
