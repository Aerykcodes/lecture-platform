const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("AWS REGION:", process.env.AWS_REGION); 
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
// Middlewares
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const subMiddleware = require("./middleware/subscriptionMiddleware");
const lectureRoutes = require("./routes/lectureRoutes");
const app = express();
const paymentRoutes = require("./routes/paymentRoutes");

// ✅ Connect DB
connectDB();
app.use((req, res, next) => {
  console.log("🌍 Request received:", req.method, req.url);
  next();
});

// ✅ Global Middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("🌍 Request received:", req.method, req.url);
  next();
});


// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/enroll",enrollmentRoutes);
app.use("/api/course",courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/lecture",lectureRoutes);
app.use("/api/payment", paymentRoutes);
// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});


// ✅ Protected Test Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data access",
    user: req.user
  });
});


// ✅ Tutor Dashboard (Paid tutors only)
app.get(
  "/api/tutor/dashboard",
  authMiddleware,
  roleMiddleware("tutor"),
  subMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Tutor Dashboard"
    });
  }
);


// ✅ Student Profile
app.get(
  "/api/student/profile",
  authMiddleware,
  roleMiddleware("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student"
    });
  }
);


// ✅ Global Error Handler (Pro Tip)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    message: "Server error"
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
