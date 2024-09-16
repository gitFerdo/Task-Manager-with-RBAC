const express = require("express");
const mongoose = require("mongoose");
const dotnet = require("dotenv");

const authRoutes = require("./routes/auth");

dotnet.config();

// Define schema
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

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

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
