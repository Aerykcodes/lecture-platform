const User = require("../models/User");

module.exports = async (req,res,next)=>{
  const user = await User.findById(req.user.id);

  if(user.role !== "tutor"){
    return res.status(403).json({
      message:"Only tutors allowed"
    });
  }

  if(!user.isSubscribed){
    return res.status(403).json({
      message:"Please subscribe first"
    });
  }

  next();
};
