import { useState, useRef } from "react";
import API from "../api";

export default function UploadLecture() {
  const [file, setFile] = useState(null);
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
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const uploadVideo = async () => {
    if (!file) { setError("Please select a video file first."); return; }
    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const res = await API.post("/upload/signed-url", {
        fileName: file.name,
        fileType: file.type,
      });
      const { uploadUrl, fileUrl } = res.data;

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => xhr.status === 200 ? resolve() : reject();
        xhr.onerror = reject;
        xhr.send(file);
      });

      await API.post("/lecture/add", { videoUrl: fileUrl });

      setProgress(100);
      setDone(true);
    } catch (err) {
      console.log(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Educational SVG background pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.045 }}
      >
        <defs>
          <pattern id="edu-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Book */}
            <g transform="translate(10,10)">
              <rect x="0" y="4" width="20" height="26" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="10" y1="4" x2="10" y2="30" stroke="#6366f1" strokeWidth="1" />
              <line x1="3" y1="10" x2="9" y2="10" stroke="#6366f1" strokeWidth="1" />
              <line x1="3" y1="14" x2="9" y2="14" stroke="#6366f1" strokeWidth="1" />
              <line x1="3" y1="18" x2="9" y2="18" stroke="#6366f1" strokeWidth="1" />
            </g>
            {/* Graduation cap */}
            <g transform="translate(70,8)">
              <polygon points="18,6 36,14 18,22 0,14" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="18" y1="22" x2="18" y2="32" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="36" y1="14" x2="36" y2="26" stroke="#6366f1" strokeWidth="1.5" />
              <circle cx="36" cy="27" r="2" fill="#6366f1" />
            </g>
            {/* Pencil */}
            <g transform="translate(8,70)">
              <rect x="0" y="0" width="6" height="24" rx="1" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <polygon points="0,24 6,24 3,30" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="0" y1="5" x2="6" y2="5" stroke="#6366f1" strokeWidth="1" />
            </g>
            {/* Play button */}
            <g transform="translate(72,68)">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#6366f1" strokeWidth="1.5" />
              <polygon points="11,9 11,23 23,16" fill="none" stroke="#6366f1" strokeWidth="1.5" />
            </g>
            {/* Star */}
            <g transform="translate(48,48)">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="none" stroke="#6366f1" strokeWidth="1.2" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#edu-pattern)" />
      </svg>

      {/* Soft corner blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />

      {/* Back nav */}
      <header className="relative z-10 bg-white bg-opacity-80 border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <a href="/tutor/dashboard" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-700">Upload Lecture</span>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-14">

        {/* Page heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Upload a Lecture</h1>
          <p className="text-sm text-gray-400">Add a video lecture to your course. Supports MP4, MOV, and WebM.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current.click()}
            className="border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer mb-6"
            style={{ borderColor: file ? "#6366f1" : "#e5e7eb", backgroundColor: file ? "rgba(99,102,241,0.03)" : "#fafafa" }}
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
                <p className="text-xs text-gray-400">or click to browse files</p>
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

          {/* Progress bar */}
          {uploading && (
            <div className="mb-6">
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

          {/* Success state */}
          {done && (
            <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 bg-green-50 border border-green-100">
              <div className="h-7 w-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Upload complete!</p>
                <p className="text-xs text-green-600">Your lecture has been saved successfully.</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 bg-red-50 border border-red-100">
              <div className="h-7 w-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={uploadVideo}
            disabled={uploading || !file || done}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#6366f1" }}
          >
            {uploading ? "Uploading..." : done ? "Uploaded!" : "Upload Lecture"}
          </button>

          {done && (
            <button
              onClick={() => { setFile(null); setDone(false); setProgress(0); }}
              className="w-full mt-3 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Upload Another
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Large files may take a few minutes. Please keep this tab open until the upload completes.
        </p>
      </div>
    </div>
  );
}