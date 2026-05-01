import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function TutorCourseManage() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    Promise.all([fetchCourse(), fetchLectures()]).then(() => setLoading(false));
  }, []);

  const fetchCourse = async () => {
    const res = await API.get("/course/" + courseId);
    setCourse(res.data);
  };

  const fetchLectures = async () => {
    const res = await API.get("/lecture/" + courseId);
    setLectures(res.data);
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Topbar */}
      {/* Topbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <a href="/tutor/dashboard" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-xs">
            {course?.title}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Course Hero Card */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">

            {/* Thumbnail */}
            <div className="lg:w-72 h-52 lg:h-auto bg-indigo-50 flex items-center justify-center flex-shrink-0">
              {course?.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">📚</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">{course?.title}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 flex-shrink-0">
                    Published
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{course?.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-5 text-sm text-gray-500">
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
                    <span>0 students</span>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">₹{course?.price}</span>
                  <button
                    onClick={() => { window.location.href = "/tutor/course/" + courseId + "/add-lecture"; }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Lecture
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Lectures</h2>
              <p className="text-sm text-gray-400">
                {lectures.length} lecture{lectures.length !== 1 ? "s" : ""} in this course
              </p>
            </div>
          </div>

          {/* Empty state */}
          {lectures.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No lectures yet</h3>
              <p className="text-sm text-gray-400 mb-5">Add your first lecture to get this course started.</p>
              <button
                onClick={() => { window.location.href = "/tutor/course/" + courseId + "/add-lecture"; }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add First Lecture
              </button>
            </div>
          )}

          {/* Lecture list */}
          {lectures.length > 0 && (
            <div className="space-y-3">
              {lectures.map((lec, index) => (
                <div
                  key={lec._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-200 hover:shadow-sm"
                >
                  {/* Lecture header row */}
                  <div className="flex items-center gap-4 p-5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {lec.title || "Lecture " + (index + 1)}
                      </p>
                      {lec.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{lec.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveVideo(activeVideo === lec._id ? null : lec._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
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
                  </div>

                  {/* Expandable video */}
                  {activeVideo === lec._id && (
                    <div className="px-5 pb-5">
                      <div className="rounded-xl overflow-hidden bg-black">
                        <video
                          src={lec.videoUrl}
                          controls
                          className="w-full max-h-80 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}