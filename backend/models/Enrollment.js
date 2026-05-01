const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseTitle: String,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model("Enrollment",enrollmentSchema);