const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  tutorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  thumbnail:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("Course",courseSchema);