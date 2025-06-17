const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName){
        throw new Error("Name is Not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email Id is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error ("Please Enter Strong Password");
    }
};





module.exports={
    validateSignUpData,
}