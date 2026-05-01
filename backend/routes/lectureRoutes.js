const express = require("express");
const router = express.Router();

const Lecture = require("../models/Lecture");
const Enrollment = require("../models/Enrollment");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================
// ADD LECTURE (TUTOR)
// ==========================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { courseId, title, videoUrl } = req.body;

    const lecture = await Lecture.create({
      courseId,
      title,
      videoUrl,
    });

    res.json(lecture);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving lecture" });
  }
});


// ==========================
// GET LECTURES (PUBLIC - NO LOCK)
// ==========================
router.get("/:courseId", async (req, res) => {
  try {
    const lectures = await Lecture.find({
      courseId: req.params.courseId,
    }).sort({ createdAt: -1 });

    res.json(lectures);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// GET LECTURES (LOCK SYSTEM)
// ==========================
router.get("/course/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    const lectures = await Lecture.find({ courseId });

    // ✅ Tutor → full access
    if (req.user.role === "tutor") {
      return res.json(lectures);
    }

    // ✅ Check enrollment
    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });

    // ❌ Not enrolled → only first lecture preview
    if (!enrollment) {
      const previewLectures = lectures.map((lec, index) => ({
        _id: lec._id,
        title: lec.title,
        description: lec.description,
        videoUrl: index === 0 ? lec.videoUrl : null,
      }));

      return res.json(previewLectures);
    }

    // ✅ Enrolled → full access
    res.json(lectures);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch lectures" });
  }
});

module.exports = router;