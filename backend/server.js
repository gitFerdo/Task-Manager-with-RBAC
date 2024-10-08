const express = require("express");
const mongoose = require("mongoose");
const dotnet = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const teamRoutes = require("./routes/teams");
const userRoutes = require("./routes/user");

dotnet.config();

// Define schema
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);
app.use("/team", teamRoutes);
app.use("/user", userRoutes);

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database connection failed:", err);
    process.exit(1);
  }
};

connectDB();

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port " + (process.env.PORT || 3000));
  });
}

module.exports = app;
