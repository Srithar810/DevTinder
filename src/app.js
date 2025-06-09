const express = require("express");
const app = express();


app.get("/test",(req,res)=>{
    res.send("get method sending sucessfully")
})

app.post("/test",(req,res)=>{
    res.send("post method sending sucessfully")
})



app.listen(3000,()=>{
    console.log("Server is running on 3000 port...");
});
