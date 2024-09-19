const request = require("supertest");
const app = require("../server"); // Assuming this is where your app is initialized
const User = require("../model/User");
const Team = require("../model/Team");
const mongoose = require("mongoose");

let adminToken, managerToken, employeeToken;
let teamId;
let admin, manager, employee;

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
//   await Team.deleteMany();

//   // Create test users: Admin, Manager, and Employee
//   admin = new User({
//     username: "admin_user",
//     password: "admin_password",
//     role: "admin",
//   });
//   await admin.save();

//   manager = new User({
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

describe("Teams API", () => {
  it("should create a new team", async () => {
    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Team A",
        members: [employee._id, manager._id],
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Team A");
    expect(response.body.members.length).toBe(2);
    teamId = response.body._id; // Store the team ID for other tests
  });

  it("should add and remove members from the team", async () => {
    // Add members
    let response = await request(app)
      .patch(`/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        addMembers: [manager._id],
      });

    expect(response.status).toBe(200);
    expect(response.body.members.length).toBeGreaterThan(2);

    // Remove members
    response = await request(app)
      .patch(`/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        removeMembers: [employee._id],
      });

    expect(response.status).toBe(200);
    expect(response.body.members.length).toBe(2); // One removed
  });

  it("should get all teams", async () => {
    const response = await request(app)
      .get("/teams/all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get all members of a specific team", async () => {
    const response = await request(app)
      .get(`/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${managerToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // Two members in the team
  });

  it("should delete a team", async () => {
    const response = await request(app)
      .delete(`/teams/${teamId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team deleted successfully");
  });
});
