const express = require("express");
const app = express();


app.use("/hello", (req,res)=>{
    res.send("Hello Srithar...!");
})  


app.use("/", (req,res)=>{
    res.send("Srithar..!");
})



app.listen(3000,()=>{
    console.log("Server is running on 3000 port...");
});
