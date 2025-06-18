const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//create user auth
authRouter.post("/signup", async (req, res) => {
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
authRouter.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid Crendential....!");
    }
    const isPasswordValid = await user.validatePassword(password);

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

module.exports = authRouter
