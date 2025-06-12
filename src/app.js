const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "anand",
    lastName: "s",
    emaiId: "ani@gmail.com",
    password: "12345",
  });

  try {
    await user.save();
    res.send("User Added Sucessfully....!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection established....");
    app.listen(5000, () => {
      console.log("server is  sucessfully lisenting on  port 5000.... ");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!....");
  });
