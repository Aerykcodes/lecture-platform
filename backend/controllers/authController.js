const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;

    const exist = await User.findOne({email});
    if(exist){
      return res.status(400).json({message:"Email exists"});
    }

    const hashed = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password:hashed,
      role: role || "student"
    });

    res.json({message:"Registered"});
  }catch(err){
    console.log(err);
  }
};


// LOGIN
exports.login = async (req,res)=>{
  try{
    const {email,password} = req.body;

    // check user
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        message:"User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({
        message:"Invalid password"
      });
    }

    // create token
    const token = jwt.sign(
      {id:user._id, role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
     );
     
     
    res.json({
      message:"Login success",
      token
    });

  }catch(err){
    console.log(err);
    res.status(500).json({message:"Server error"});
  }
};
