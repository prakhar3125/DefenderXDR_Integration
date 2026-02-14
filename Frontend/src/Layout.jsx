import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar, { MobileHeader, MobileBottomNav } from "./Navbar";

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
      height: "100vh",
      minHeight: "100vh",
      background: "#050b17",
      color: "#c0d4ec",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
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

        /* Prevent text selection on mobile for better UX */
        @media (max-width: 768px) {
          * {
            -webkit-user-select: none;
            user-select: none;
          }
          
          /* Allow selection in input fields */
          input, textarea {
            -webkit-user-select: text;
            user-select: text;
          }
        }

        /* Font family for all elements */
        input, select, button, textarea {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
        }

        /* Remove tap highlight on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* Navbar - Desktop only OR Mobile Header */}
      {isMobile ? <MobileHeader /> : <Navbar />}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        overflow: "hidden", 
        display: "flex", 
        flexDirection: "column",
        position: "relative"
      }}>
        <Outlet />
      </div>

      {/* Mobile Bottom Nav - Only on mobile */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}