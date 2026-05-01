import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function TutorPublic() {
  const { subdomain } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTutor();
  }, []);

  const fetchTutor = async () => {
    try {
      const res = await API.get("/tutor/public/" + subdomain);
      setTutor(res.data);
      fetchCourses(res.data.tutorId);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (tutorId) => {
    try {
      const res = await API.get("/course/public/" + tutorId);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (tutor?.websiteTitle || tutor?.name || "T")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const primary = tutor?.primaryColor || "#6366f1";
  const secondary = tutor?.secondaryColor || "#ec4899";
  const font = tutor?.font || "Arial, sans-serif";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block rounded-full h-10 w-10 border-2 border-t-transparent mb-3"
            style={{ borderColor: primary, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-sm text-gray-400 font-medium">Loading profile...</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.196-3.796M9 20H4v-2a4 4 0 015.196-3.796M15 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Tutor not found</h3>
          <p className="text-sm text-gray-400">This profile doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: font }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: primary }}>

        {/* Subtle grid overlay on hero */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.08 }}>
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="36" y2="0" stroke="#fff" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="0" y2="36" stroke="#fff" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Blob */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)", transform: "translate(-30%, 30%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">

          {/* Avatar */}
          {tutor.logoUrl ? (
            <img
              src={tutor.logoUrl}
              alt={tutor.websiteTitle}
              className="w-20 h-20 rounded-2xl object-cover mb-5 shadow-lg border-2 border-white border-opacity-30"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-5 shadow-lg border-2 border-white border-opacity-20"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              {initials}
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            {tutor.websiteTitle}
          </h1>

          {tutor.bio && (
            <p className="text-white text-opacity-80 text-sm max-w-lg leading-relaxed mb-5" style={{ opacity: 0.8 }}>
              {tutor.bio}
            </p>
          )}

          {/* Stats pills */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-white border-opacity-20" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-white border-opacity-20" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              {subdomain}.yoursite.com
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full" style={{ display: "block" }}>
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* Courses section */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Section header + search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Courses</h2>
            <p className="text-sm text-gray-400">
              {search
                ? filtered.length + " result" + (filtered.length !== 1 ? "s" : "") + " for \"" + search + "\""
                : courses.length + " course" + (courses.length !== 1 ? "s" : "") + " available"}
            </p>
          </div>

          {courses.length > 0 && (
            <div className="relative max-w-xs w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none bg-white shadow-sm transition-colors"
                style={{ "--tw-ring-color": primary }}
                onFocus={(e) => { e.target.style.borderColor = primary; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty — no courses */}
        {courses.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-20 px-6">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ backgroundColor: primary + "15" }}
            >
              <svg className="w-7 h-7" style={{ color: primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No courses yet</h3>
            <p className="text-sm text-gray-400">Check back soon — new courses are on the way.</p>
          </div>
        )}

        {/* Empty — search */}
        {courses.length > 0 && filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-14 px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No results for "{search}"</h3>
            <p className="text-sm text-gray-400 mb-4">Try a different search term.</p>
            <button
              onClick={() => setSearch("")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Course grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
                style={{ "--hover-border": primary }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary + "60"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                {/* Thumbnail */}
                <div className="h-44 flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: primary + "12" }}>
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
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{course.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => navigate("/course/" + course._id, { state: { from: `/site/${subdomain}`, label: "Back" } })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: secondary }}
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

        {/* Footer */}
        <div className="mt-14 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            {tutor.websiteTitle} · Powered by{" "}
            <span className="font-semibold" style={{ color: primary }}>EduSite</span>
          </p>
        </div>
      </div>
    </div>
  );
}