const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  // Register a new user and test the login
  //   it("should register a new user and return a token", async () => {
  //     // Step 1: Register a new user
  //     const registrationResponse = await request(app)
  //       .post("/auth/register")
  //       .send({
  //         username: "newTestUser",
  //         password: "newpassword",
  //         role: "admin",
  //       });

  //     // Log response for debugging
  //     console.log("Registration Response:", registrationResponse.body);

  //     expect(registrationResponse.status).toBe(201); // Expecting a successful registration

  //     // Step 2: Login with the newly registered user
  //     const loginResponse = await request(app)
  //       .post("/auth/login")
  //       .send({ username: "newTestUser", password: "newpassword" });

  //     expect(loginResponse.status).toBe(200);
  //     expect(loginResponse.body.token).toBeDefined();
  //     expect(loginResponse.body.role).toBe("admin");
  //   });

  it("should login a user and return a token", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "admin123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.role).toBe("admin");
  });

  it("should fail to login with wrong credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "wrong", password: "wrongpassword" });

    expect(response.status).toBe(404);
  });
});
