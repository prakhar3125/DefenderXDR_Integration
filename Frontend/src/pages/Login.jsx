import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Lock, User, AlertCircle, Eye, EyeOff, 
  Globe, Fingerprint 
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// MSAL CONFIGURATION (Microsoft Entra ID)
// ═══════════════════════════════════════════════════════════════
const msalConfig = {
  auth: {
    clientId: "YOUR_AZURE_CLIENT_ID", // Replace with your App Registration Client ID
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

// Scopes for Microsoft Graph & Defender API
const loginRequest = {
  scopes: ["User.Read", "SecurityIncident.Read.All"]
};

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Microsoft SSO Logic ──────────────────────────────────────
  const handleMicrosoftLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // In production, use the MSAL hook: instance.loginPopup(loginRequest)
      console.log("Initializing Microsoft SSO Flow...");
      
      // Simulating SSO success for demo
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Microsoft Authentication Failed. Check your network.");
      setLoading(false);
    }
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Access Denied.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#050810",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #00d4ff !important; outline: none; box-shadow: 0 0 10px rgba(0, 212, 255, 0.2); }
        .sso-btn:hover { background: #005a9e !important; }
      `}</style>

      <div style={{
        background: "#0a0e1a",
        border: "1px solid #1a2332",
        borderRadius: "4px",
        padding: "40px",
        width: "400px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ 
            width: "64px", height: "64px", background: "rgba(255, 32, 85, 0.1)", 
            borderRadius: "12px", display: "flex", alignItems: "center", 
            justifyContent: "center", margin: "0 auto 16px",
            border: "1px solid #ff205540"
          }}>
            <Shield size={32} style={{ color: "#ff2055" }} />
          </div>
          <h1 style={{ fontSize: "16px", fontWeight: 800, color: "#e0e6f0", letterSpacing: "0.1em" }}>
            SOC SENTINEL <span style={{ color: "#00d4ff" }}>XDR</span>
          </h1>
          <p style={{ fontSize: "9px", color: "#4a6a8a", textTransform: "uppercase", marginTop: "4px" }}>
            Classification: Top Secret // System Access
          </p>
        </div>

        {/* ─── MICROSOFT SSO BUTTON ─── */}
        <button
          onClick={handleMicrosoftLogin}
          className="sso-btn"
          style={{
            width: "100%",
            padding: "12px",
            background: "#0078d4", // Official Microsoft Blue
            color: "white",
            border: "none",
            borderRadius: "3px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "24px",
            transition: "background 0.2s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 23 23">
            <path fill="#fff" d="M11.5 0h-11.5v11.5h11.5v-11.5zM23 0h-11.5v11.5h11.5v-11.5zM11.5 11.5h-11.5v11.5h11.5v-11.5zM23 11.5h-11.5v11.5h11.5v-11.5z"/>
          </svg>
          LOGIN WITH MICROSOFT SSO
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#1a2332" }} />
          <span style={{ fontSize: "9px", color: "#2e4a65" }}>OR MANUAL ENTRY</span>
          <div style={{ flex: 1, height: "1px", background: "#1a2332" }} />
        </div>

        {error && (
          <div style={{ 
            background: "rgba(255, 32, 85, 0.1)", border: "1px solid #ff2055", 
            padding: "10px", borderRadius: "3px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#ff2055"
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleManualLogin}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ position: "relative" }}>
              <User size={14} style={{ position: "absolute", left: "12px", top: "14px", color: "#2e4a65" }} />
              <input
                type="text" placeholder="OPERATOR ID"
                value={username} onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: "100%", padding: "14px 14px 14px 40px", 
                  background: "#040a16", border: "1px solid #1a2332",
                  borderRadius: "3px", color: "#c0d4ec", fontSize: "11px"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: "12px", top: "14px", color: "#2e4a65" }} />
              <input
                type={showPassword ? "text" : "password"} placeholder="SECURITY KEY"
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: "100%", padding: "14px 40px 14px 40px", 
                  background: "#040a16", border: "1px solid #1a2332",
                  borderRadius: "3px", color: "#c0d4ec", fontSize: "11px"
                }}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "14px", background: "none", border: "none", color: "#2e4a65", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#1a2332" : "linear-gradient(90deg, #ff2055, #00d4ff)",
              border: "none", borderRadius: "3px", color: "#fff",
              fontSize: "12px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "VERIFYING..." : "INITIALIZE SESSION"}
          </button>
        </form>
      </div>
    </div>
  );
}