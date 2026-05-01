const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Enrollment = require("../models/Enrollment");
const auth = require("../middleware/authMiddleware");


// ✅ ENROLL COURSE
router.post("/enroll", auth, async (req,res)=>{
  try{

    const { tutorId, courseTitle, price } = req.body;

    const enrollment = await Enrollment.create({
      studentId: new mongoose.Types.ObjectId(req.user.id),
      tutorId: new mongoose.Types.ObjectId(tutorId),
      courseTitle,
      price
    });

    res.json({
      message:"Enrolled successfully 🎉",
      enrollment
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Enrollment failed"
    });
  }
});


// ✅ GET MY COURSES
router.get("/my-courses", auth, async (req, res) => {
  try {
    const courses = await Enrollment.find({
      studentId: req.user.id,
    }).populate("tutorId", "name"); // ✅ important

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;