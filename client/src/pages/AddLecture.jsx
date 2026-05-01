import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const BG_PATTERN = `
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
    <g transform="translate(10,10)">
      <rect x="0" y="4" width="20" height="26" rx="2" fill="none" stroke="%236366f1" stroke-width="1.5"/>
      <line x1="10" y1="4" x2="10" y2="30" stroke="%236366f1" stroke-width="1"/>
      <line x1="3" y1="10" x2="9" y2="10" stroke="%236366f1" stroke-width="1"/>
      <line x1="3" y1="14" x2="9" y2="14" stroke="%236366f1" stroke-width="1"/>
      <line x1="3" y1="18" x2="9" y2="18" stroke="%236366f1" stroke-width="1"/>
    </g>
    <g transform="translate(70,8)">
      <polygon points="18,6 36,14 18,22 0,14" fill="none" stroke="%236366f1" stroke-width="1.5"/>
      <line x1="18" y1="22" x2="18" y2="32" stroke="%236366f1" stroke-width="1.5"/>
      <line x1="36" y1="14" x2="36" y2="26" stroke="%236366f1" stroke-width="1.5"/>
      <circle cx="36" cy="27" r="2" fill="%236366f1"/>
    </g>
    <g transform="translate(8,70)">
      <rect x="0" y="0" width="6" height="24" rx="1" fill="none" stroke="%236366f1" stroke-width="1.5"/>
      <polygon points="0,24 6,24 3,30" fill="none" stroke="%236366f1" stroke-width="1.5"/>
      <line x1="0" y1="5" x2="6" y2="5" stroke="%236366f1" stroke-width="1"/>
    </g>
    <g transform="translate(72,68)">
      <circle cx="16" cy="16" r="14" fill="none" stroke="%236366f1" stroke-width="1.5"/>
      <polygon points="11,9 11,23 23,16" fill="none" stroke="%236366f1" stroke-width="1.5"/>
    </g>
    <g transform="translate(48,48)">
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="none" stroke="%236366f1" stroke-width="1.2"/>
    </g>
  </svg>
`;

const bgStyle = {
  backgroundImage: "url(\"data:image/svg+xml," + BG_PATTERN.replace(/\n\s*/g, " ").trim() + "\")",
  backgroundRepeat: "repeat",
  backgroundSize: "120px 120px",
  opacity: 0.045,
};

export default function AddLecture() {
  const { courseId } = useParams();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type.startsWith("video/")) {
      setFile(f);
      setDone(false);
      setError("");
    } else {
      setError("Please select a valid video file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a video file first."); return; }
    if (!title.trim()) { setError("Please enter a lecture title."); return; }

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const res = await API.post("/upload/signed-url", {
        fileName: file.name,
        fileType: file.type,
        courseId,
      });

      const { uploadUrl, fileUrl } = res.data;

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
        xhr.onerror = reject;
        xhr.send(file);
      });

      await API.post("/lecture/add", {
        courseId,
        title: title.trim(),
        videoUrl: fileUrl,
      });

      setProgress(100);
      setDone(true);
    } catch (err) {
      console.log(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setDone(false);
    setProgress(0);
    setError("");
  };

  const dropZoneStyle = {
    borderWidth: "2px",
    borderStyle: "dashed",
    borderColor: file ? "#6366f1" : "#e5e7eb",
    backgroundColor: file ? "rgba(99,102,241,0.03)" : "#fafafa",
    cursor: uploading ? "not-allowed" : "pointer",
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Background pattern via CSS background-image */}
      <div className="absolute inset-0 w-full h-full" style={bgStyle} />

      {/* Blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }}
      />

      {/* Topbar */}
      <header className="relative z-10 bg-white bg-opacity-80 border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <a href={"/tutor/course/" + courseId} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700">Add Lecture</span>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-14">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a Lecture</h1>
          <p className="text-sm text-gray-400">Upload a video and give your lecture a title.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-6">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Lecture Title
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Variables"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 bg-gray-50 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Drop zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Video File
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current.click()}
              className="rounded-2xl p-10 text-center transition-colors"
              style={dropZoneStyle}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {!file ? (
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Drag and drop your video here</p>
                  <p className="text-xs text-gray-400">or click to browse — MP4, MOV, WebM supported</p>
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 mb-4">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-0.5 truncate px-4">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                  {!uploading && (
                    <p className="text-xs text-indigo-500 mt-2 font-medium">Click to change file</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: progress + "%", backgroundColor: "#6366f1" }}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="px-4 py-3 rounded-xl flex items-center gap-3 bg-green-50 border border-green-100">
              <div className="h-7 w-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Lecture added!</p>
                <p className="text-xs text-green-600">Your lecture has been saved to the course.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl flex items-center gap-3 bg-red-50 border border-red-100">
              <div className="h-7 w-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || done}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#6366f1" }}
          >
            {uploading ? "Uploading..." : done ? "Uploaded!" : "Upload Lecture"}
          </button>

          {done && (
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Add Another
              </button>
              <button
                onClick={() => { window.location.href = "/tutor/course/" + courseId; }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-center border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Back to Course
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Keep this tab open until the upload completes. Large files may take a few minutes.
        </p>
      </div>
    </div>
  );
}