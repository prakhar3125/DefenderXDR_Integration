import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP NAVBAR (Original)
// ═══════════════════════════════════════════════════════════════

function DesktopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getButtonStyle = (path) => ({
    padding: "5px 12px",
    background: isActive(path) ? "#00d4ff10" : "transparent",
    border: `1px solid ${isActive(path) ? "#00d4ff35" : "#111d30"}`,
    borderRadius: "3px",
    color: isActive(path) ? "#00d4ff" : "#2e4a65",
    fontSize: "9px",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    transition: "all 0.15s",
    textTransform: "uppercase"
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px",
      height: "46px",
      background: "#040a16",
      borderBottom: "1px solid #090f1e",
      flexShrink: 0,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>

      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,20 2,20" fill="none" stroke="#ff2055" strokeWidth="1.5"/>
          <polygon points="12,7 19,18 5,18" fill="#ff205512" stroke="#ff205528" strokeWidth="0.5"/>
          <circle cx="12" cy="16" r="1.5" fill="#ff2055"/>
          <line x1="12" y1="10" x2="12" y2="14" stroke="#ff2055" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          <div style={{ 
            fontSize: "12px", 
            fontWeight: 700, 
            color: "#d0e8ff", 
            letterSpacing: "0.06em", 
            lineHeight: 1 
          }}>
            SOC SENTINEL
          </div>
          <div style={{ 
            fontSize: "7px", 
            color: "#1a3050", 
            letterSpacing: "0.2em", 
            lineHeight: 1.4 
          }}>
            DEFENDER XDR
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <button 
          onClick={() => navigate("/dashboard")} 
          style={getButtonStyle("/dashboard")}
          onMouseEnter={(e) => { 
            if (!isActive("/dashboard")) {
              e.currentTarget.style.background = "#111d30"; 
              e.currentTarget.style.color = "#4a7090";
            }
          }}
          onMouseLeave={(e) => { 
            if (!isActive("/dashboard")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#2e4a65";
            }
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Dashboard
        </button>

        <button 
          onClick={() => navigate("/notifications")} 
          style={getButtonStyle("/notifications")}
          onMouseEnter={(e) => { 
            if (!isActive("/notifications")) {
              e.currentTarget.style.background = "#111d30";
              e.currentTarget.style.color = "#4a7090";
            }
          }}
          onMouseLeave={(e) => { 
            if (!isActive("/notifications")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#2e4a65";
            }
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Alerts
        </button>

        <button 
          onClick={() => navigate("/analytics")} 
          style={getButtonStyle("/analytics")}
          onMouseEnter={(e) => { 
            if (!isActive("/analytics")) {
              e.currentTarget.style.background = "#111d30";
              e.currentTarget.style.color = "#4a7090";
            }
          }}
          onMouseLeave={(e) => { 
            if (!isActive("/analytics")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#2e4a65";
            }
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
          Intelligence
        </button>

        <button 
          onClick={() => navigate("/settings")} 
          style={getButtonStyle("/settings")}
          onMouseEnter={(e) => { 
            if (!isActive("/settings")) {
              e.currentTarget.style.background = "#111d30";
              e.currentTarget.style.color = "#4a7090";
            }
          }}
          onMouseLeave={(e) => { 
            if (!isActive("/settings")) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#2e4a65";
            }
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"/>
          </svg>
          Config
        </button>

        {/* Separator */}
        <div style={{ width: "1px", height: "18px", background: "#090f1e", margin: "0 4px" }} />

        {/* Live Status Indicator */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "5px",
          padding: "5px 10px",
          background: "#00ff9d08",
          border: "1px solid #00ff9d20",
          borderRadius: "3px"
        }}>
          <div style={{ 
            width: "6px", 
            height: "6px", 
            borderRadius: "50%", 
            background: "#00ff9d", 
            animation: "pulse 2.2s infinite" 
          }} />
          <span style={{ 
            fontSize: "8px", 
            color: "#164030", 
            letterSpacing: "0.12em", 
            fontWeight: 700 
          }}>
            LIVE
          </span>
        </div>

        {/* Separator */}
        <div style={{ width: "1px", height: "18px", background: "#090f1e", margin: "0 4px" }} />

        {/* Logout Button */}
        <button 
          onClick={() => navigate("/login")} 
          style={{
            padding: "5px 10px",
            background: "transparent",
            border: "1px solid #ff205535",
            borderRadius: "3px",
            color: "#ff2055",
            fontSize: "9px",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            transition: "all 0.15s",
            textTransform: "uppercase"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ff205510";
            e.currentTarget.style.borderColor = "#ff2055";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#ff205535";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Exit
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE COMPONENTS - Exported separately for Layout.jsx
// ═══════════════════════════════════════════════════════════════

export function MobileHeader() {
  return (
    <div style={{
      height: "56px",
      background: "#040a16",
      borderBottom: "1px solid #090f1e",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      flexShrink: 0
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 22,20 2,20" fill="none" stroke="#ff2055" strokeWidth="1.5"/>
        <polygon points="12,7 19,18 5,18" fill="#ff205512" stroke="#ff205528" strokeWidth="0.5"/>
        <circle cx="12" cy="16" r="1.5" fill="#ff2055"/>
        <line x1="12" y1="10" x2="12" y2="14" stroke="#ff2055" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div style={{ marginLeft: "12px", flex: 1 }}>
        <div style={{ 
          fontSize: "14px", 
          fontWeight: 700, 
          color: "#d0e8ff", 
          letterSpacing: "0.04em",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
        }}>
          SOC SENTINEL
        </div>
        <div style={{ 
          fontSize: "8px", 
          color: "#1a3050", 
          letterSpacing: "0.15em",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
        }}>
          DEFENDER XDR
        </div>
      </div>
      
      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ 
          width: "6px", 
          height: "6px", 
          borderRadius: "50%", 
          background: "#00ff9d",
          animation: "pulse 2s infinite"
        }} />
        <span style={{ 
          fontSize: "8px", 
          color: "#164030", 
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
        }}>
          LIVE
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { 
      path: "/dashboard", 
      icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", 
      label: "Home" 
    },
    { 
      path: "/notifications", 
      icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", 
      label: "Alerts" 
    },
    { 
      path: "/analytics", 
      icon: "M18 20V10 M12 20V4 M6 20v-6", 
      label: "Stats" 
    },
    { 
      path: "/settings", 
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", 
      label: "Menu" 
    }
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#040a16",
      borderTop: "1px solid #090f1e",
      padding: "8px 0",
      paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
      display: "flex",
      justifyContent: "space-around",
      zIndex: 1000,
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.3)"
    }}>
      {navItems.map(({ path, icon, label }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: "none",
              border: "none",
              color: active ? "#00d4ff" : "#2e4a65",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              flex: 1,
              position: "relative",
              transition: "all 0.2s",
              WebkitTapHighlightColor: "transparent"
            }}
          >
            {/* Active indicator */}
            {active && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "32px",
                height: "2px",
                background: "#00d4ff",
                borderRadius: "0 0 2px 2px"
              }} />
            )}
            
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon}/>
            </svg>
            <span style={{ 
              fontSize: "9px", 
              fontWeight: active ? 700 : 600,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              letterSpacing: "0.04em"
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN NAVBAR COMPONENT - Desktop only
// ═══════════════════════════════════════════════════════════════

export default function Navbar() {
  const isMobile = useIsMobile();

  // On mobile, Layout.jsx handles rendering MobileHeader + MobileBottomNav
  // So we only render desktop navbar here
  if (isMobile) {
    return null;
  }

  return <DesktopNavbar />;
}