const express = require("express");
const mongoose = require("mongoose");
const dotnet = require("dotenv");

dotnet.config();
const app = express();
app.use(express.json());

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
