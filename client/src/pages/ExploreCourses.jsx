import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/course/all")
      .then((res) => setCourses(res.data || []))
      .catch((err) => {
        console.error("ExploreCourses error:", err?.response?.status, err?.response?.data, err?.message);
        setError("Failed to load courses. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c?.tutorId?.name?.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />

      {/* Topbar */}
      <header className="relative z-20 bg-white bg-opacity-80 border-b border-gray-100 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Left — back + brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/student/courses")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:block">Dashboard</span>
            </button>
            <span className="text-gray-200 hidden sm:block">/</span>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">Explore Courses</span>
            </div>
          </div>

          {/* Right — search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 bg-white shadow-sm transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">All Courses</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-400">
              {search
                ? filtered.length + " result" + (filtered.length !== 1 ? "s" : "") + " for \"" + search + "\""
                : courses.length + " course" + (courses.length !== 1 ? "s" : "") + " available"}
            </p>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
                  <div className="h-3 bg-gray-100 rounded-lg w-full" />
                  <div className="h-3 bg-gray-100 rounded-lg w-5/6" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-100 rounded-lg w-16" />
                    <div className="h-8 bg-gray-100 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white border border-red-100 rounded-2xl shadow-sm text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h3>
            <p className="text-sm text-gray-400 mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty — no courses at all */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-20 px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 mb-4">
              <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No courses yet</h3>
            <p className="text-sm text-gray-400">New courses are on the way. Check back soon.</p>
          </div>
        )}

        {/* Empty — search no results */}
        {!loading && !error && courses.length > 0 && filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No results found</h3>
            <p className="text-sm text-gray-400 mb-4">No courses match "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Course grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="h-44 bg-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl">📚</span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Tutor */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                      {(course?.tutorId?.name || "T")[0].toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {course?.tutorId?.name || "Instructor"}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {course.description}
                  </p>

                  {/* Price + CTA */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => navigate("/course/" + course._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      View Course
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}