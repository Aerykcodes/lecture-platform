const mongoose = require("mongoose");

const tutorProfileSchema = new mongoose.Schema({
  tutorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  websiteTitle:String,
  bio:String,
  logoUrl:String,

  primaryColor:String,
  secondaryColor:String,
  font:String,

  subdomain:{
    type:String,
    unique:true
  }

});

module.exports = mongoose.model("TutorProfile",tutorProfileSchema);
