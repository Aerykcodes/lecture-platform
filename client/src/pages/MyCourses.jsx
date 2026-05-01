import { useEffect, useState, useRef } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchCourses();
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/enroll/my-courses");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setProfile(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "S";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mb-3"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-sm text-gray-400 font-medium">Loading your courses...</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Background dot pattern */}
      {/* Background grid pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="36" y2="0" stroke="#818cf8" strokeWidth="0.6" />
            <line x1="0" y1="0" x2="0" y2="36" stroke="#818cf8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />

      {/* Topbar */}
      <header className="relative z-20 bg-white bg-opacity-80 border-b border-gray-100 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">EduSite</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <span className="font-semibold text-indigo-600 cursor-default">My Learning</span>
            <button onClick={() => navigate("/courses")} className="hover:text-gray-800 transition-colors bg-transparent border-none cursor-pointer">
              Explore Courses
            </button>
          </nav>

          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white transition-all text-sm font-medium text-gray-700"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:block">{profile?.name?.split(" ")[0] || "Student"}</span>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{profile?.name || "Student"}</p>
                  <p className="text-xs text-gray-400 truncate">{profile?.email || ""}</p>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/courses"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explore Courses
                  </button>

                  <button
                    onClick={() => { setMenuOpen(false); navigate("/student/courses"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Learning
                  </button>
                </div>

                <div className="p-1.5 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            My Learning 🎓
          </h1>
          <p className="text-sm text-gray-500">
            {courses.length > 0
              ? "Pick up where you left off."
              : "Start learning something new today."}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            {
              label: "Enrolled Courses",
              value: courses.length,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
            },
            {
              label: "In Progress",
              value: courses.length,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
            {
              label: "Completed",
              value: 0,
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-50 text-indigo-500">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl text-center py-20 px-6 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No courses yet</h3>
            <p className="text-sm text-gray-400 mb-6">Browse our catalog and start learning today.</p>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Courses
            </button>
          </div>
        )}

        {/* Course grid */}
        {courses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                <p className="text-sm text-gray-400">{courses.length} course{courses.length !== 1 ? "s" : ""} enrolled</p>
              </div>
              <button
                onClick={() => navigate("/courses")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore More
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="h-44 bg-indigo-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {course?.thumbnail ? (
                      <img src={course.thumbnail} alt={course.courseTitle} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">📚</span>
                    )}
                    {/* Progress pill */}
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-600 border border-indigo-100">
                      In Progress
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                      {course?.courseTitle || "Course"}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      by {course?.tutorId?.name || "Instructor"}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: "0%" }} />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!course?.courseId) return;
                        navigate("/course/" + course.courseId);
                      }}
                      className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      Continue Learning →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}