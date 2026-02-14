import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

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
// MAIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Layout() {
  const isMobile = useIsMobile();

  return (
    <div style={{
      width: "100%",
      // Use 100dvh for mobile browsers (accounts for dynamic viewport - address bar)
      // Fallback to 100vh for older browsers
      height: "100dvh",
      minHeight: "-webkit-fill-available", // Safari iOS fix
      background: "#050b17",
      color: "#c0d4ec",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      // Prevent pull-to-refresh on mobile
      overscrollBehavior: "none",
      // Prevent text selection on mobile (optional, improves UX)
      WebkitUserSelect: "none",
      userSelect: "none"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        /* Global resets for mobile */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        /* iOS Safari specific fixes */
        html {
          height: -webkit-fill-available;
        }

        body {
          min-height: 100vh;
          min-height: -webkit-fill-available;
          overscroll-behavior: none;
        }

        /* Fix for iOS Safari bouncing */
        #root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        /* Scrollbar styles for desktop */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #111d30;
          border-radius: 3px;
        }

        /* Mobile: hide scrollbars */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            display: none;
          }
          
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }

        /* Font family for all elements */
        input, select, button, textarea {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
        }
      `}</style>

      {/* Navbar (conditionally renders mobile/desktop) */}
      <Navbar />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        overflow: "hidden", 
        display: "flex", 
        flexDirection: "column",
        // Consolidate into a single paddingBottom property
        paddingBottom: isMobile 
          ? "calc(60px + env(safe-area-inset-bottom, 0px))" 
          : 0
      }}>
        <Outlet />
      </div>
    </div>
  );
}