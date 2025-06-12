const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://srithars810:kEZucJh1g60az8cv@cluster0.gvsjzwf.mongodb.net/DevTinderDB"
    );
};

module.exports= connectDB;