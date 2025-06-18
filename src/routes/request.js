const express = require("express");
const requestRouter= express.Router();
const {userAuth}= require("../middlewars/auth")

//send connection request
requestRouter.get("/sendConnectionRequest",userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.status(200).send(user.firstName+ " send connection request");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

  module.exports=requestRouter;