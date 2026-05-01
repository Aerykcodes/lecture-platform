import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function TutorSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    websiteTitle: "",
    bio: "",
    logoUrl: "",
    primaryColor: "#6366f1",
    secondaryColor: "#ec4899",
    font: "Poppins",
    subdomain: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    twitter: "",
    linkedin: "",
    avatar: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/tutor/setup", form);
      setShowSuccess(true);
      setTimeout(() => navigate("/tutor/dashboard"), 2000);
    } catch (err) {
      alert("Error saving profile");
      console.log(err);
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      await API.post("/tutor/profile", profileForm);
      setSheetOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "#f7f7f5",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

      {/* Profile Button — Top Right */}
      <button
        onClick={() => setSheetOpen(true)}
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#fff",
          border: "1.5px solid #e4e4e0",
          borderRadius: "100px",
          padding: "8px 18px 8px 10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          color: "#333",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          zIndex: 40
        }}
      >
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: form.primaryColor, display: "flex",
          alignItems: "center", justifyContent: "center"
        }}>
          <svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        My Profile
      </button>

      {/* Success Dialog */}
      {showSuccess && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "40px",
            textAlign: "center", maxWidth: "320px", width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "#f0fdf4", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 16px"
            }}>
              <svg width="24" height="24" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "#111" }}>
              Profile Saved! 🎉
            </h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Setting up your dashboard...</p>
          </div>
        </div>
      )}

      {/* Profile Side Sheet */}
      <div
        onClick={() => setSheetOpen(false)}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
          zIndex: 45, opacity: sheetOpen ? 1 : 0,
          pointerEvents: sheetOpen ? "all" : "none",
          transition: "opacity 0.3s ease"
        }}
      />
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
        {/* Sheet Header */}
        <div style={{
          padding: "28px 28px 20px",
          borderBottom: "1px solid #f0f0ee",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111", margin: 0 }}>My Profile</h2>
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

        {/* Sheet Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* Avatar preview */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: form.primaryColor + "22",
              border: `2px solid ${form.primaryColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0
            }}>
              {profileForm.avatar
                ? <img src={profileForm.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <svg width="28" height="28" fill="none" stroke={form.primaryColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Avatar URL</label>
              <input
                name="avatar"
                placeholder="https://..."
                value={profileForm.avatar}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>
          </div>

          {[
            { name: "name", label: "Full Name", placeholder: "Aaryan Sharma" },
            { name: "email", label: "Email", placeholder: "aaryan@email.com" },
            { name: "phone", label: "Phone", placeholder: "+91 9876543210" },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                name={field.name}
                placeholder={field.placeholder}
                value={profileForm[field.name]}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>
          ))}

          <div style={{ margin: "24px 0 16px", borderTop: "1px solid #f0f0ee", paddingTop: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              Social Links
            </p>
            {[
              { name: "twitter", label: "Twitter / X", placeholder: "@username" },
              { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={profileForm[field.name]}
                  onChange={handleProfileChange}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sheet Footer */}
        <div style={{ padding: "20px 28px", borderTop: "1px solid #f0f0ee" }}>
          <button
            onClick={handleProfileSave}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: form.primaryColor,
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div style={{
        width: "100%",
        maxWidth: "560px",
        background: "#fff",
        borderRadius: "24px",
        border: "1px solid #e8e8e4",
        overflow: "hidden",
        boxShadow: "0 2px 24px rgba(0,0,0,0.06)"
      }}>
        {/* Card Header */}
        <div style={{
          padding: "36px 40px 28px",
          borderBottom: "1px solid #f0f0ee",
          textAlign: "center"
        }}>
          <div style={{
            width: "48px", height: "48px",
            borderRadius: "14px",
            background: form.primaryColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "#111",
            margin: "0 0 6px",
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic"
          }}>
            Setup Your Website
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Customize your teaching platform in minutes
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "32px 40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Website Title */}
            <div>
              <label style={labelStyle}>Website Title</label>
              <input
                name="websiteTitle"
                placeholder="e.g., Aaryan's Learning Hub"
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={labelStyle}>Your Bio</label>
              <textarea
                name="bio"
                placeholder="Tell students about yourself and your teaching philosophy..."
                onChange={handleChange}
                rows="3"
                required
                style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
              />
            </div>

            {/* Logo URL */}
            <div>
              <label style={labelStyle}>
                Logo URL
                <span style={{ color: "#aaa", fontWeight: "400", marginLeft: "6px" }}>(optional)</span>
              </label>
              <input
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Colors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { name: "primaryColor", label: "Primary Color" },
                { name: "secondaryColor", label: "Secondary Color" }
              ].map(c => (
                <div key={c.name}>
                  <label style={labelStyle}>{c.label}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={{ cursor: "pointer", position: "relative" }}>
                      <input
                        type="color"
                        name={c.name}
                        value={form[c.name]}
                        onChange={handleChange}
                        style={{ opacity: 0, position: "absolute", width: "100%", height: "100%", cursor: "pointer" }}
                      />
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: form[c.name],
                        border: "1.5px solid rgba(0,0,0,0.1)",
                        flexShrink: 0
                      }} />
                    </label>
                    <input
                      type="text"
                      value={form[c.name]}
                      readOnly
                      style={{
                        ...inputStyle,
                        fontFamily: "monospace",
                        fontSize: "13px",
                        padding: "8px 12px"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Font */}
            <div>
              <label style={labelStyle}>Font Style</label>
              <select
                name="font"
                onChange={handleChange}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center"
                }}
              >
                <option value="Poppins">Poppins — Modern & Friendly</option>
                <option value="Arial">Arial — Clean & Professional</option>
                <option value="Roboto">Roboto — Minimal & Tech</option>
              </select>
            </div>

            {/* Subdomain */}
            <div>
              <label style={labelStyle}>Your Subdomain</label>
              <div style={{ position: "relative" }}>
                <input
                  name="subdomain"
                  placeholder="aaryancodes"
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingRight: "130px" }}
                />
                <span style={{
                  position: "absolute", right: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "13px", color: "#aaa", pointerEvents: "none", fontWeight: "500"
                }}>
                  .yoursite.com
                </span>
              </div>
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#aaa" }}>
                This will be your unique website address
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "28px",
              width: "100%",
              padding: "14px",
              borderRadius: "13px",
              border: "none",
              background: loading ? "#ccc" : form.primaryColor,
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s"
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: "spin 0.8s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                  <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Saving...
              </>
            ) : "Save & Continue →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px", padding: "0 40px 28px" }}>
          You can always change these settings later from your dashboard
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #c0c0bb; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${form.primaryColor}; box-shadow: 0 0 0 3px ${form.primaryColor}22; }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#444",
  marginBottom: "7px",
  letterSpacing: "0.01em"
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
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s"
};