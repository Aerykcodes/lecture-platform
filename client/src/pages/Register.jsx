import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

// Dialog Component
function Dialog({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{ maxWidth: "400px", width: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {isSuccess ? "Registration Successful!" : "Something went wrong"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Continue to Login" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    console.log("📤 Sending registration data:", form);
  
    try {
      const res = await API.post("/auth/register", form);
      console.log("✅ Registration success:", res.data);
      setLoading(false);
      setDialog({
        type: "success",
        message: "Your account has been created successfully! Please sign in to continue.",
      });
    } catch (err) {
      setLoading(false);
  
      console.log("❌ Registration error:");
      console.log("   Status:", err.response?.status);
      console.log("   Response data:", err.response?.data);
      console.log("   Message:", err.response?.data?.message);
      console.log("   Full error:", err);
  
      let message = "Server Error. Please try again.";
  
      if (err.response?.status === 400 || err.response?.status === 409) {
        if (
          err.response.data?.message?.includes("email") ||
          err.response.data?.message?.includes("exists") ||
          err.response.data?.message?.includes("already")
        ) {
          message = "This email is already registered. Please use a different email or sign in.";
        } else {
          message = err.response.data?.message || "Registration failed. Please check your details.";
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data) {
        // catches cases where error is a string or object without .message
        message = typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);
      }
  
      console.log("🔴 Showing dialog with message:", message);
      setDialog({ type: "error", message });
    }
  };

  const handleDialogClose = () => {
    if (dialog.type === "success") {
      navigate("/login");
    }
    setDialog({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Dialog */}
      <Dialog type={dialog.type} message={dialog.message} onClose={handleDialogClose} />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your learning journey</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${
                errors.name ? "border-red-500" : "border-gray-200"
              } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">I want to join as</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition cursor-pointer"
            >
              <option value="student">Student - Learn from courses</option>
              <option value="tutor">Tutor - Create and teach courses</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}