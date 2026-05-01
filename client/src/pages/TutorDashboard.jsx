import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    twitter: "",
    linkedin: "",
    avatar: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0
  });
  useEffect(() => {
    init();
  }, []);

  const init = async () => {

    await Promise.all([fetchProfile(), fetchCourses(), fetchStats()]);
  
    setLoading(false);
  
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/tutor/me");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/course/my");
      setCourses(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchStats = async () => {
    try {
      const res = await API.get("/course/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      await API.post("/tutor/profile", profileForm);
      setSheetOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const primary = profile?.primaryColor || "#6366f1";
  const secondary = profile?.secondaryColor || "#ec4899";

  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "all") return matchSearch;
    return matchSearch; // extend for published/draft filters
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            border: `3px solid ${primary}`, borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite", margin: "0 auto 16px"
          }} />
          <p style={{ color: "#777", fontSize: "14px", fontFamily: "Poppins, sans-serif" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Poppins', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* Side Sheet Overlay */}
      <div
        onClick={() => setSheetOpen(false)}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
          zIndex: 45, opacity: sheetOpen ? 1 : 0,
          pointerEvents: sheetOpen ? "all" : "none",
          transition: "opacity 0.3s ease"
        }}
      />

      {/* Profile Sheet */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "400px", maxWidth: "92vw",
        background: "#fff",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        zIndex: 46,
        transform: sheetOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.32,.72,0,1)",
        display: "flex", flexDirection: "column"
      }}>
        <div style={{
          padding: "28px 28px 20px",
          borderBottom: "1px solid #f0f0ee",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>Edit Profile</h2>
            <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>Personal info & social links</p>
          </div>
          <button
            onClick={() => setSheetOpen(false)}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: "1.5px solid #e4e4e0", background: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <svg width="14" height="14" fill="none" stroke="#555" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: primary + "18",
              border: `2px solid ${primary}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0
            }}>
              {profileForm.avatar
                ? <img src={profileForm.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <svg width="28" height="28" fill="none" stroke={primary} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Avatar URL</label>
              <input name="avatar" placeholder="https://..." value={profileForm.avatar}
                onChange={handleProfileChange} style={inputStyle} />
            </div>
          </div>

          {[
            { name: "name", label: "Full Name", placeholder: "Aaryan Sharma" },
            { name: "email", label: "Email", placeholder: "aaryan@email.com" },
            { name: "phone", label: "Phone", placeholder: "+91 9876543210" },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>{f.label}</label>
              <input name={f.name} placeholder={f.placeholder}
                value={profileForm[f.name]} onChange={handleProfileChange} style={inputStyle} />
            </div>
          ))}

          <div style={{ margin: "24px 0 16px", borderTop: "1px solid #f0f0ee", paddingTop: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Social Links</p>
            {[
              { name: "twitter", label: "Twitter / X", placeholder: "@username" },
              { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>{f.label}</label>
                <input name={f.name} placeholder={f.placeholder}
                  value={profileForm[f.name]} onChange={handleProfileChange} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 28px", borderTop: "1px solid #f0f0ee" }}>
          <button onClick={handleProfileSave} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "none",
            background: primary, color: "#fff", fontSize: "15px", fontWeight: "600",
            cursor: "pointer", fontFamily: "inherit"
          }}>
            Save Profile
          </button>
        </div>
      </div>

      {/* Top Nav */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #eeede9",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", position: "sticky", top: 0, zIndex: 30
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {profile?.logoUrl
            ? <img src={profile.logoUrl} alt="logo" style={{ height: "28px" }} />
            : <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: primary, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
          }
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#111" }}>
            {profile?.websiteTitle || "My Platform"}
          </span>
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          style={{
            background: "transparent",
            border: "1.5px solid #e8e8e4",
            borderRadius: "100px",
            padding: "6px 14px 6px 8px",
            display: "flex", alignItems: "center", gap: "8px",
            cursor: "pointer", fontSize: "13px", fontWeight: "500",
            color: "#333", fontFamily: "inherit"
          }}
        >
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: primary + "22", border: `1.5px solid ${primary}`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="13" height="13" fill="none" stroke={primary} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          {profile?.websiteTitle || "Profile"}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 28px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "28px", fontWeight: "700", color: "#111",
            margin: "0 0 4px",
            fontFamily: "'Instrument Serif', serif", fontStyle: "italic"
          }}>
            Welcome back, {profile?.websiteTitle || "Tutor"} 👋
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Here's what's happening with your courses today
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "28px"
        }}>
          {[
            {
              label: "Total Courses",
              value: courses.length,
              icon: (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              accent: primary
            },
            {
              label: "Total Earnings",
              value: "₹" + stats.totalEarnings,
              sub: "All-time revenue",
              icon: (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              accent: secondary
            },
            {
              label: "Active Students",
              value: stats.totalStudents,
              sub: "Start enrolling!",
              icon: (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              accent: primary
            }
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #eeede9",
              padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#999", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: "26px", fontWeight: "700", color: "#111", margin: 0 }}>
                  {stat.value}
                </p>
                {stat.sub && <p style={{ fontSize: "11px", color: "#bbb", margin: "3px 0 0" }}>{stat.sub}</p>}
              </div>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: stat.accent + "15",
                color: stat.accent,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Website Card */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #eeede9",
          padding: "24px 28px",
          marginBottom: "28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: primary + "15",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: primary
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: "600", fontSize: "14px", color: "#111", margin: "0 0 2px" }}>Your Public Site</p>
              <p style={{ fontSize: "13px", color: primary, fontFamily: "monospace", margin: 0 }}>
                {profile?.subdomain || "not-set"}.yoursite.com
              </p>
            </div>
          </div>
          <a
            href={`/site/${profile?.subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "9px 20px",
              borderRadius: "10px",
              background: primary,
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            View Site
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Courses Section */}
        <div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "18px", flexWrap: "wrap", gap: "12px"
          }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: "0 0 2px" }}>Your Courses</h2>
              <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>Manage and track all your courses</p>
            </div>
            <button
              onClick={() => window.location = "/tutor/create-course"}
              style={{
                padding: "9px 18px",
                borderRadius: "10px",
                border: "none",
                background: primary,
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              New Course
            </button>
          </div>

          {/* Search + Filters */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #eeede9",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f3f3f0",
              display: "flex", gap: "12px", alignItems: "center",
              flexWrap: "wrap"
            }}>
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  width="15" height="15" fill="none" stroke="#aaa" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px 8px 36px",
                    border: "1.5px solid #e8e8e4", borderRadius: "9px",
                    fontSize: "13px", color: "#333", background: "#fafaf8",
                    fontFamily: "inherit", boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["all", "published", "drafts"].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "8px",
                      border: activeFilter === f ? "none" : "1.5px solid #e8e8e4",
                      background: activeFilter === f ? primary : "transparent",
                      color: activeFilter === f ? "#fff" : "#666",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textTransform: "capitalize"
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: "#f3f3f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <svg width="24" height="24" fill="none" stroke="#bbb" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333", margin: "0 0 8px" }}>No courses yet</h3>
                <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>
                  Start creating your first course to share your expertise!
                </p>
                <button
                  onClick={() => window.location = "/tutor/create-course"}
                  style={{
                    padding: "10px 22px", borderRadius: "10px", border: "none",
                    background: primary, color: "#fff",
                    fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", fontFamily: "inherit"
                  }}
                >
                  Create Your First Course
                </button>
              </div>
            )}

            {/* Course Grid */}
            {filteredCourses.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1px",
                background: "#f3f3f0"
              }}>
                {filteredCourses.map(course => (
                  <div
                    key={course._id}
                    style={{
                      background: "#fff",
                      padding: "0 0 20px",
                      transition: "box-shadow 0.2s"
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: "100%", height: "160px",
                      background: primary + "12",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden"
                    }}>
                      {course.thumbnail
                        ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "48px" }}>📚</span>
                      }
                    </div>

                    <div style={{ padding: "16px 20px 0" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                        <h3 style={{ fontWeight: "600", fontSize: "15px", color: "#111", margin: 0, flex: 1, lineHeight: "1.4" }}>
                          {course.title}
                        </h3>
                      </div>

                      <span style={{
                        display: "inline-block",
                        fontSize: "11px", fontWeight: "600",
                        background: primary + "15", color: primary,
                        padding: "2px 9px", borderRadius: "100px", marginBottom: "10px"
                      }}>
                        published
                      </span>

                      <p style={{ color: "#888", fontSize: "12px", marginBottom: "12px", lineHeight: "1.5",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                      }}>
                        {course.description}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span style={{ fontSize: "12px", color: "#aaa", display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {course.students || 0} students
                          </span>
                        </div>
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#111" }}>₹{course.price}</span>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => window.location = `/tutor/course/${course._id}`}
                          style={{
                            flex: 1, padding: "8px", borderRadius: "9px",
                            border: "1.5px solid #e8e8e4", background: "transparent",
                            color: "#555", fontSize: "12px", fontWeight: "600",
                            cursor: "pointer", fontFamily: "inherit"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/course/${course._id}`)}
                          style={{
                            flex: 1, padding: "8px", borderRadius: "9px",
                            border: "none", background: primary,
                            color: "#fff", fontSize: "12px", fontWeight: "600",
                            cursor: "pointer", fontFamily: "inherit"
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#444",
  marginBottom: "7px"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e8e8e4",
  borderRadius: "11px",
  fontSize: "14px",
  color: "#222",
  background: "#fafaf8",
  fontFamily: "inherit",
  boxSizing: "border-box"
};