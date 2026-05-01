const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const auth = require("../middleware/authMiddleware");

console.log("🔥🔥 PAYMENT ROUTES LOADED 🔥🔥");

// =========================
// RAZORPAY INSTANCE
// =========================
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// TEST ROUTE
// =========================
router.get("/test", (req, res) => {
    console.log("🔥 test route hit");
    res.send("Payment route working ✅");
});

// =========================
// CREATE ORDER
// =========================
router.post("/create-order", async (req, res) => {
    console.log("🔥 create-order hit");

    try {
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100, // ₹ → paise
            currency: "INR",
        });

        console.log("✅ Order created:", order.id);

        res.json({
            orderId: order.id,
            amount: order.amount,
        });

    } catch (err) {
        console.log("❌ Razorpay error:", err);
        res.status(500).json({ message: "Order creation failed" });
    }
});

// =========================
// VERIFY PAYMENT
// =========================
router.post("/verify", auth, async (req, res) => {
    console.log("🔥 verify route hit");

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
        } = req.body;

        console.log("👉 BODY:", req.body);

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        console.log("👉 EXPECTED:", expectedSignature);
        console.log("👉 RECEIVED:", razorpay_signature);

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // ✅ GET COURSE FIRST
        const course = await Course.findById(courseId);
        console.log("COURSE FOUND:", course);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // ❌ Prevent tutor enrolling own course
        if (course.tutorId.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot enroll in your own course",
            });
        }

        // ✅ Prevent duplicate
        const existing = await Enrollment.findOne({
            studentId: req.user.id,
            courseId,
        });

        if (existing) {
            return res.json({
                success: true,
                message: "Already enrolled",
            });
        }

        // ✅ CREATE ENROLLMENT
        await Enrollment.create({
            studentId: req.user.id,
            tutorId: course.tutorId,
            courseId: course._id,
            courseTitle: course.title,
            price: course.price,
        });

        console.log("✅ Enrollment created");

        res.json({ success: true });

    } catch (err) {
        console.log("❌ Verification error:", err);
        res.status(500).json({ message: "Verification failed" });
    }
});

module.exports = router;