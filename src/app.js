const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.send("get method sending sucessfully");
});

app.post("/test", (req, res) => {
  res.send("post method sending sucessfully");
});


//------next() useage in route
app.use(
  "/us*er",
  (req, res,next) => {
    console.log("Handling the route user! ");
    next();
    res.send("Response1....!!!!");
    
  },
  (req, res) => {
    console.log("Handling the route user1....! ");
    res.send("Response2....!!!!");
  }
);

app.listen(3000, () => {
  console.log("Server is running on 3000 port...");
});
