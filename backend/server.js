const express = require("express");
const mongoose = require("mongoose");
const dotnet = require("dotenv");

const authRoutes = require("./routes/auth");

dotnet.config();

// Define schema
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Server started.`);
});
