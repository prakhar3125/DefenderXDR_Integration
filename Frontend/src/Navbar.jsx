// Navbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, Home, PieChart, Settings, LogOut, Bell 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine if a tab is active
  const isActive = (path) => location.pathname === path;

  // Common button style
  const getButtonStyle = (path) => ({
    padding: "8px 12px",
    background: isActive(path) ? "#00d9ff20" : "#1a2332",
    border: isActive(path) ? "1px solid #00d9ff" : "1px solid #1a2332",
    borderRadius: "4px",
    color: isActive(path) ? "#00d9ff" : "#7a8599",
    fontSize: "11px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: isActive(path) ? 600 : 400,
    transition: "all 0.2s"
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 20px",
      background: "#0a0e1a",
      borderBottom: "1px solid #1a2332",
      flexShrink: 0 // Prevents navbar from shrinking
    }}>
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          background: "linear-gradient(135deg, #ff0844, #00d9ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Shield size={20} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", color: "#e0e6f0" }}>
            SOC COMMAND CENTER
          </div>
          <div style={{ fontSize: "9px", color: "#7a8599" }}>
            Microsoft Defender XDR Integration
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => navigate("/dashboard")} style={getButtonStyle("/dashboard")}>
          <Home size={12} />
          Dashboard
        </button>

        <button onClick={() => navigate("/notifications")} style={getButtonStyle("/notifications")}>
          <Bell size={12} />
          Notifications
        </button>

        <button onClick={() => navigate("/analytics")} style={getButtonStyle("/analytics")}>
          <PieChart size={12} />
          Analytics
        </button>

        <button onClick={() => navigate("/settings")} style={getButtonStyle("/settings")}>
          <Settings size={12} />
          Settings
        </button>

        <button 
          onClick={() => navigate("/login")} 
          style={{ ...getButtonStyle("logout"), background: "#1a2332", border: "1px solid #ff0844", color: "#ff0844" }}
        >
          <LogOut size={12} />
        </button>
      </div>
    </div>
  );
}