const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },
  title:String,
  videoUrl:String
},{timestamps:true});

module.exports = mongoose.model("Lecture",lectureSchema);