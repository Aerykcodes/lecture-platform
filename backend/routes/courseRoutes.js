const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware"); // ✅ FIXED


// ============================
// CREATE COURSE
// ============================
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("tutor"),
  async (req, res) => {
    try {
      const course = await Course.create({
        ...req.body,
        tutorId: req.user.id,
      });

      res.json(course);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error creating course",
      });
    }
  }
);


// ============================
// GET MY COURSES (Tutor Dashboard)
// ============================
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("tutor"),
  async (req, res) => {
    try {
      const courses = await Course.find({
        tutorId: req.user.id,
      });

      res.json(courses);
    } catch (err) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ============================
// GET TUTOR STATS (🔥 MAIN FIX)
// ============================
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("tutor"),
  async (req, res) => {
    try {
      const tutorId = req.user.id;

      const enrollments = await Enrollment.find({ tutorId });

      const totalStudents = enrollments.length;

      const totalEarnings = enrollments.reduce(
        (sum, e) => sum + (e.price || 0),
        0
      );

      res.json({
        totalStudents,
        totalEarnings,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  }
);


// ============================
// PUBLIC — GET COURSES OF TUTOR
// ============================
router.get("/public/:tutorId", async (req, res) => {
  try {
    const { tutorId } = req.params;

    const courses = await Course.find({ tutorId });

    res.json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});


// ============================
// GET ALL COURSES (PUBLIC)
// ============================
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("tutorId", "name subdomain");

    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});


// ============================
// GET SINGLE COURSE
// ============================
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;