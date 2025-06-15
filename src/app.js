const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());

//create user postmethod
app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Sucessfully....!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//Get user by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something Went wrong");
  }
});

//feed all data from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Something Went wrong");
  }
});

//update user by id

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const Allowed_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => Allowed_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User Updated Sucessfully");
  } catch (err) {
    res.status(500).send("UPDATE FAILED: " + err.message);
  }
});

//delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("User Deleted Sucessfully");
  } catch (err) {
    res.status(500).send("Something Went wrong");
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
