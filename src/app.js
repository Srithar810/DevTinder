const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const { userAuth } = require("./middlewars/auth");

app.use(express.json());
app.use(cookieParser());

//create user postmethod
app.post("/signup", async (req, res) => {
  try {
    //validate of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordhash = await bcrypt.hash(password, 10);
    console.log(passwordhash);

    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
    });
    await user.save();
    res.send("User Added Sucessfully....!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//login
app.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid Crendential....!");
    }
    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Sucessfully...!!");
    } else {
      throw new Error("invalid Crendential....!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
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

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills Cannot be more than 10");
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
