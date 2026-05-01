import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [summarizing, setSummarizing] = useState({});

  const token = localStorage.getItem("token");
  const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;
  const isStudent = userRole === "student";
  const [isEnrolled, setIsEnrolled] = useState(false);
  useEffect(() => {
    Promise.all([fetchCourse(), fetchLectures()]).then(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (token) checkEnrollment();
  }, []);
  const fetchCourse = async () => {
    try {
      const res = await API.get("/course/" + courseId);
      setCourse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await API.get("/lecture/course/" + courseId);
      setLectures(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { state: { from: "/course/" + courseId } });
      return;
    }

    setEnrolling(true);

    try {
      const orderRes = await API.post("/payment/create-order", {
        amount: course.price,
      });

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Lecture Platform",
        description: course.title,
        order_id: order.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
              },
              { headers: { Authorization: "Bearer " + token } }
            );

            if (verifyRes.data.success) {
              setIsEnrolled(true); // 
              navigate("/student/courses");
            } else {
              alert(verifyRes.data.message || "Verification failed");
            }
          } catch (err) {
            console.log("VERIFY ERROR:", err.response?.data || err);
            alert("Verification failed");
          }
        },

        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    } finally {
      setEnrolling(false);
    }
  };
  const checkEnrollment = async () => {
    try {
      const res = await API.get("/enroll/my-courses");
  
      const found = res.data.find(
        (c) => c.courseId?.toString() === courseId
      );
  
      if (found) {
        setIsEnrolled(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const generateSummary = async (lec) => {
    setSummarizing((prev) => ({ ...prev, [lec._id]: true }));
    try {
      const res = await fetch("http://localhost:8001/process-video-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: lec.videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Server error " + res.status + ": " + JSON.stringify(data));
      }
      setSummaries((prev) => ({ ...prev, [lec._id]: data.summary }));
    } catch (err) {
      console.error("Summary error:", err);
      setSummaries((prev) => ({ ...prev, [lec._id]: "Error: " + (err?.message || String(err)) }));
    } finally {
      setSummarizing((prev) => ({ ...prev, [lec._id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-3"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-sm text-gray-400 font-medium">Loading course...</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="36" y2="0" stroke="#818cf8" strokeWidth="0.6" />
            <line x1="0" y1="0" x2="0" y2="36" stroke="#818cf8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />

      {/* Topbar */}
      <header className="relative z-20 bg-white bg-opacity-80 border-b border-gray-100 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <button
            onClick={() => {
              if (location.state?.from) navigate(location.state.from);
              else if (userRole === "tutor") navigate("/tutor/dashboard");
              else navigate("/courses");
            }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {location.state?.from ? "Back" : userRole === "tutor" ? "Dashboard" : "Explore Courses"}
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-xs">{course?.title}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Hero card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">

            {/* Thumbnail */}
            <div className="lg:w-80 h-56 lg:h-auto bg-indigo-50 flex items-center justify-center flex-shrink-0">
              {course?.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl">📚</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug flex-1">
                    {course?.title}
                  </h1>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0 mt-1">
                    Available
                  </span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {course?.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span>{lectures.length} lecture{lectures.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.196-3.796M9 20H4v-2a4 4 0 015.196-3.796M15 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>by {course?.tutorId?.name || "Instructor"}</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Course Price</p>
                  <p className="text-3xl font-bold text-gray-900">₹{course?.price}</p>
                </div>
                {userRole !== "tutor" && (
  isEnrolled ? (
    <button
      disabled
      className="flex-1 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-green-500 cursor-not-allowed"
    >
      Enrolled ✅
    </button>
  ) : (
    <button
      onClick={handleEnroll}
      disabled={enrolling}
      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
    >
      {enrolling ? "Processing..." : "Enroll Now"}
    </button>
  )
)}
              </div>
            </div>
          </div>
        </div>

        {/* Lectures section */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Course Lectures</h2>
            <p className="text-sm text-gray-400">
              {lectures.length} lecture{lectures.length !== 1 ? "s" : ""} in this course
            </p>
          </div>

          {/* Empty */}
          {lectures.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-14 px-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 mb-4">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No lectures yet</h3>
              <p className="text-xs text-gray-400">The instructor hasn't added any lectures yet. Check back soon.</p>
            </div>
          )}

          {/* Lecture list */}
          {lectures.length > 0 && (
            <div className="space-y-3">
              {lectures.map((lec, index) => {
                const locked = !lec.videoUrl;
                return (
                  <div
                    key={lec._id}
                    className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${locked ? "border-gray-200 opacity-75" : "border-gray-200 hover:border-indigo-200 hover:shadow-md"}`}
                  >
                    <div className="flex items-center gap-4 p-5">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${locked ? "bg-gray-100" : "bg-indigo-50"}`}>
                        {locked ? (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V9a4 4 0 10-8 0v2M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold text-indigo-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${locked ? "text-gray-400" : "text-gray-900"}`}>
                          {lec.title || "Lecture " + (index + 1)}
                        </p>
                        {lec.description && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">{lec.description}</p>
                        )}
                      </div>

                      {locked ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V9a4 4 0 10-8 0v2M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                          </svg>
                          Enroll to unlock
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveVideo(activeVideo === lec._id ? null : lec._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors flex-shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {activeVideo === lec._id ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            )}
                          </svg>
                          {activeVideo === lec._id ? "Hide" : "Preview"}
                        </button>
                      )}
                    </div>

                    {!locked && activeVideo === lec._id && (
                      <div className="px-5 pb-5">
                        <div className="rounded-xl overflow-hidden bg-black shadow-inner">
                          <video
                            src={lec.videoUrl}
                            controls
                            className="w-full max-h-80 object-contain"
                          />
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={() => generateSummary(lec)}
                            disabled={summarizing[lec._id]}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {summarizing[lec._id] ? (
                              <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Generating Summary...
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generate Summary
                              </>
                            )}
                          </button>

                          {summaries[lec._id] && (
                            <div className="mt-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                              <p className="text-xs font-semibold text-indigo-600 mb-1.5">AI Summary</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{summaries[lec._id]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}