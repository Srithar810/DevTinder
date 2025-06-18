const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewars/auth");
const { vaildateEditprofileData } = require("../utils/validation");

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


//update
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!vaildateEditprofileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedUser = req.user;
    // console.log(loggedUser);

    Object.keys(req.body).forEach(
      (keys) => (loggedUser[keys] = req.body[keys])
    );
    await loggedUser.save();

    // console.log(loggedUser);

    res.json({
      message: `${loggedUser.firstName}, your Profile Updated Sucessfully`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
