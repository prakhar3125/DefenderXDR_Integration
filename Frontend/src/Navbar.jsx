import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, Home, PieChart, Settings, LogOut, Bell 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getButtonStyle = (path) => ({
    padding: "6px 14px",
    background: isActive(path) ? "#00d9ff15" : "transparent",
    border: isActive(path) ? "1px solid #00d9ff" : "1px solid transparent",
    borderRadius: "2px", // Sharper corners for a more tactical look
    color: isActive(path) ? "#00d9ff" : "#7a8599",
    fontSize: "12px",
    fontFamily: "'Inter', system-ui, sans-serif", // Clean professional font
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: isActive(path) ? 600 : 500,
    textTransform: "uppercase", // Tactical feel
    letterSpacing: "0.03em",
    transition: "all 0.15s ease-in-out"
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: "64px", // Fixed height is better for command centers
      background: "#0a0e1a",
      borderBottom: "1px solid #1a2332",
      flexShrink: 0,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Global CSS Inject to ensure fonts load if they are on the system */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "4px",
          background: "linear-gradient(135deg, #ff0844 0%, #00d9ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px rgba(0, 217, 255, 0.3)"
        }}>
          <Shield size={18} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ 
            fontSize: "13px", 
            fontWeight: 800, 
            letterSpacing: "0.1em", 
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace" // Data-centric font
          }}>
            SOC COMMAND <span style={{ color: "#00d9ff" }}>XDR</span>
          </div>
          <div style={{ 
            fontSize: "10px", 
            color: "#7a8599", 
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em" 
          }}>
            System Status: <span style={{ color: "#00ff88" }}>Operational</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => navigate("/dashboard")} style={getButtonStyle("/dashboard")}>
          <Home size={14} />
          Dashboard
        </button>

        <button onClick={() => navigate("/notifications")} style={getButtonStyle("/notifications")}>
          <Bell size={14} />
          Alerts
        </button>

        <button onClick={() => navigate("/analytics")} style={getButtonStyle("/analytics")}>
          <PieChart size={14} />
          Intelligence
        </button>

        <button onClick={() => navigate("/settings")} style={getButtonStyle("/settings")}>
          <Settings size={14} />
          Config
        </button>

        {/* Separator */}
        <div style={{ width: "1px", height: "24px", background: "#1a2332", margin: "0 8px" }} />

        <button 
          onClick={() => navigate("/login")} 
          style={{ 
            ...getButtonStyle("logout"), 
            border: "1px solid #ff084420", 
            color: "#ff0844",
            background: "transparent"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#ff084410"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}