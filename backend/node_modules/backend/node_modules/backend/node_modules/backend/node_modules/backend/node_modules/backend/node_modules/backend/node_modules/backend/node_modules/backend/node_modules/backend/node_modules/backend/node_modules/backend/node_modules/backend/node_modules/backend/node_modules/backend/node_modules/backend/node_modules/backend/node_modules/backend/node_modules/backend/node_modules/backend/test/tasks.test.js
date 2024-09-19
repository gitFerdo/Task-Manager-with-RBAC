const request = require("supertest");
const app = require("../server");
const User = require("../model/User");
const Task = require("../model/Task");
const mongoose = require("mongoose");

let adminToken, managerToken, employeeToken;
let employee; // To store employee details for task assignment

// Set up a single MongoDB connection for all tests
// beforeAll(async () => {
//   jest.setTimeout(20000);

//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(
//       process.env.MONGO_URL || "mongodb://localhost:27017/taskManagerTestDB",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//   }

//   // Clean the database before running tests
//   await User.deleteMany();
//   await Task.deleteMany();

//   // Create test users: Admin, Manager, and Employee
//   const admin = new User({
//     username: "admin_user",
//     password: "admin_password",
//     role: "admin",
//   });
//   await admin.save();
//   const manager = new User({
//     username: "manager_user",
//     password: "manager_password",
//     role: "manager",
//   });
//   await manager.save();
//   employee = new User({
//     username: "employee_user",
//     password: "employee_password",
//     role: "employee",
//   });
//   await employee.save();

//   // Admin login and token generation
//   const adminResponse = await request(app).post("/auth/login").send({
//     username: "admin_user",
//     password: "admin_password",
//   });
//   adminToken = adminResponse.body.token;

//   // Manager login and token generation
//   const managerResponse = await request(app).post("/auth/login").send({
//     username: "manager_user",
//     password: "manager_password",
//   });
//   managerToken = managerResponse.body.token;

//   // Employee login and token generation
//   const employeeResponse = await request(app).post("/auth/login").send({
//     username: "employee_user",
//     password: "employee_password",
//   });
//   employeeToken = employeeResponse.body.token;
// });

// // Clean up after all tests
// afterAll(async () => {
//   await mongoose.connection.close(); // Properly close the connection after tests
// });

describe("Tasks API", () => {
  it("should create a new task", async () => {
    const response = await request(app)
      .post("/")
      .set("Authorization", `Bearer ${adminToken}`) // Admin creates a task
      .send({
        title: "New Task",
        description: "Task description",
        assignedTo: employee._id,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Task");
    expect(response.body.assignedTo.toString()).toBe(employee._id.toString());
  });

  it("should update an existing task", async () => {
    // Create a task to update
    const task = await Task.create({
      title: "Task to Update",
      description: "Initial description",
      assignedTo: employee._id,
    });

    const response = await request(app)
      .put(`/${task._id}`)
      .set("Authorization", `Bearer ${adminToken}`) // Admin updates the task
      .send({
        title: "Updated Task",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
  });

  it("should update the status of a task", async () => {
    // Create a task to update its status
    const task = await Task.create({
      title: "Task to Update Status",
      description: "Initial description",
      assignedTo: employee._id,
      status: "pending",
    });

    const response = await request(app)
      .put(`/${task._id}/status`)
      .set("Authorization", `Bearer ${managerToken}`) // Manager updates task status
      .send({
        status: "in-progress",
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("in-progress");
  });

  it("should get tasks for admin", async () => {
    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${adminToken}`); // Admin fetches tasks

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get tasks for manager", async () => {
    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${managerToken}`); // Manager fetches tasks

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get tasks for employee", async () => {
    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${employeeToken}`); // Employee fetches tasks

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should delete a task", async () => {
    // Create a task to delete
    const task = await Task.create({
      title: "Task to Delete",
      description: "Initial description",
      assignedTo: employee._id,
    });

    const response = await request(app)
      .delete(`/${task._id}`)
      .set("Authorization", `Bearer ${managerToken}`); // Manager deletes the task

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully");
  });
});
