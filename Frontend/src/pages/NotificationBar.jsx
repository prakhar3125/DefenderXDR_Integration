import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Bell, X, ExternalLink, AlertTriangle, CheckCircle, 
  Clock, User, Volume2, VolumeX, Filter, RefreshCw
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION BAR - Persistent across all pages
// ═══════════════════════════════════════════════════════════════

const SEVERITY_CONFIG = {
  High: { color: "#ff0844", icon: AlertTriangle, label: "High" },
  Medium: { color: "#ffaa00", icon: AlertTriangle, label: "Medium" },
  Low: { color: "#00d9ff", icon: AlertTriangle, label: "Low" },
  Informational: { color: "#7a8599", icon: AlertTriangle, label: "Informational" }
};

const STATUS_CONFIG = {
  New: { color: "#ff0844", icon: Bell, label: "New" },
  Active: { color: "#00d9ff", icon: AlertTriangle, label: "Active" },
  Resolved: { color: "#00ff88", icon: CheckCircle, label: "Resolved" }
};

// Generate mock notification
const generateNotification = (id) => {
  const severities = ["High", "Medium", "Low"];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  return {
    id: `notif-${id}`,
    incidentId: 924000 + id,
    incidentName: [
      "Suspicious PowerShell command line detected",
      "Multi-stage ransomware attack in progress",
      "Credential dumping activity detected",
      "Phishing email clicked by user",
      "Unusual outbound connection to C2 server"
    ][Math.floor(Math.random() * 5)],
    severity: severity,
    status: "New",
    deviceName: ["WS-FINANCE-001", "SRV-WEB-PROD", "WS-HR-042"][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString(),
    read: false,
    webUrl: `https://security.microsoft.com/incidents/${924000 + id}`
  };
};

export default function NotificationBar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Notification sound
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+l9r0xW8pBSl+zO/aizsIGGS57OihUQ0LTKXh8bllHAU2jdXyzn0vBSF1xe7gnEILDlyx5/G0YhoHPJPY88p5KwUme8rx4JA+CRZiturqpVINCkqk4PG6ZBwGM4nU8tGAMQYeb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKoHO8diJOQcZaLvt559NEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N2RQAoUXrTp66hVFApGnt/yvmwhBjGH0fPTgjMHHW/A7eSaRw0PVqzl77BeGQc9mNn0xnAoBSh+zO/aizsIGGS56+mjTxAKTKXh8bllHAU1jdT0z3wvBSJ0xe7gnEILDlyx5/G0YhoHPJPY88p5KwUme8rx4JA+CRVht+rqpVMNCkqj4PG6ZBwGM4nU8tGAMQYfb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKoHO8diJOQcZZ7vs6KBOEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N+RQAoUXrTp66hVFApGnt/yvmwhBjGH0fPTgjMHHm/A7uSaRw0PVqzl77BeGQc9mNn0xnAoBSh+zO/aizsIGGS56+mjTxAKTKXh8bllHAU1jdT0z3wvBSJ0xe7gnEILDlyx5/G0YhoHPJPY88p5KwUme8rx4JA+CRVht+rqpVMNCkqj4PG6ZBwGM4nU8tGAMQYfb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKoHO8diJOQcZZ7vs6KBOEAxPqOPwtmMcBjiP1/PMeS0GI3fH8N+RQAoUXrTp66hVFApGnt/yvmwhBjGH0fPTgjMHHm/A7uSaRw0PVqzl77BeGQc9mNn0xnAoBSh+zO/aizsIGGS56+mjTxAKTKXh8bllHAU1jdT0z3wvBSJ0xe7gnEILDlyx5/G0YhoHO5LY88p5KwUme8rx4JA+CRVht+rqpVMNCkqj4PG6ZBwGM4nU8tGAMQYfb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKoHO8diJOQcZZ7vs6KBOEAxPqOPwtmMcBjiP1/PMeSsGI3fH8N+RQAoUXrTp66hVFApGnt/yvmwhBjGH0fPTgjMHHm/A7uSaRw0PVqzl77BeGQc9mNn0xnAoBSh+zO/aizsIGGS56+mjTxAKS6Xh8bllHAU1jdT0z3wvBSJ0xe7gnEILDlyx5/G0YhoHO5LY88p5KwUme8rx4JA+CRVht+rqpVMNCkqj4PG6ZBwGM4nU8tGAMQYfb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKn/O8diJOQcZZ7vs6KBOEAxPpuPwtmMcBjiP1/PMeSsGI3fH8N+RQAoUXrTp66hVFApGnt/yvmwhBjGH0fPTgjMHHm/A7uSaRw0PVqzl77BeGQc9mNn0xnAoBSh9zO/aizsIGGS56+mjTxAKS6Xh8bllHAU1jdT0z3wvBSJ0xe7gnEILDlyx5/G0YhoHO5LY88p5KwUme8rx4JA+CRVht+rqpVMNCkqj4PG6ZBwGM4nU8tGAMQYfb8Lv45dFDBBYr+fxsF4XCT6Y2/PKdSYEKn/O8diJOQcZZ7vs6KBOEAxPpuPwtmMcBjiP1/PMeSsGI3fH8N+RQAoUXrTp66hVE=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Desktop notification
  const showDesktopNotification = (notif) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("🚨 New Security Incident", {
        body: `${notif.incidentName} - ${notif.deviceName}`,
        icon: "/icons/alert.png",
        tag: notif.id,
        requireInteraction: notif.severity === "High"
      });

      notification.onclick = () => {
        window.focus();
        navigate(`/incidents/${notif.incidentId}`);
      };
    }
  };

  // Request permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Auto-refresh simulation (simulates polling Defender API)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate new incident (in production: fetch from API)
      if (Math.random() > 0.7) {
        const newNotif = generateNotification(Date.now());
        setNotifications(prev => [newNotif, ...prev]);
        
        // Play sound and show desktop notification
        playNotificationSound();
        showDesktopNotification(newNotif);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, soundEnabled]);

  // Filter notifications
  const filteredNotifications = notifications.filter(n => 
    filterSeverity === "ALL" || n.severity === filterSeverity
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#050810",
      color: "#e0e6f0",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1a2332; border-radius: 4px; }
        ::selection { background: #00d9ff; color: #000; }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>


      {/* Stats Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#0a0e1a",
        borderBottom: "1px solid #1a2332"
      }}>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Bell size={14} style={{ color: "#00d9ff" }} />
            <span style={{ color: "#7a8599" }}>Total:</span>
            <span style={{ color: "#e0e6f0", fontWeight: 600 }}>{notifications.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff0844",
              animation: unreadCount > 0 ? "pulse 2s infinite" : "none"
            }} />
            <span style={{ color: "#7a8599" }}>Unread:</span>
            <span style={{ color: "#ff0844", fontWeight: 600 }}>{unreadCount}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              padding: "6px 10px",
              background: "#050810",
              border: "1px solid #1a2332",
              borderRadius: "4px",
              color: "#e0e6f0",
              fontSize: "10px"
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: "6px 12px",
                background: "#1a2332",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                color: "#7a8599",
                fontSize: "10px",
                cursor: "pointer"
              }}
            >
              Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: "6px 12px",
                background: "#1a2332",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                color: "#7a8599",
                fontSize: "10px",
                cursor: "pointer"
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px"
      }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#7a8599",
            gap: "16px"
          }}>
            <Bell size={64} style={{ opacity: 0.3 }} />
            <div style={{ fontSize: "14px" }}>No notifications</div>
            <div style={{ fontSize: "11px" }}>
              {notifications.length === 0 
                ? "You're all caught up!" 
                : "No notifications match your filter"}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredNotifications.map((notif, index) => {
              const severityConfig = SEVERITY_CONFIG[notif.severity];
              const statusConfig = STATUS_CONFIG[notif.status];

              return (
                <div
                  key={notif.id}
                  style={{
                    background: notif.read ? "#0a0e1a" : "#12161f",
                    border: `1px solid ${notif.read ? "#1a2332" : severityConfig.color}`,
                    borderLeft: `3px solid ${severityConfig.color}`,
                    borderRadius: "4px",
                    padding: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: index === 0 && !notif.read ? "slideIn 0.3s ease-out" : "none"
                  }}
                  onClick={() => {
                    markAsRead(notif.id);
                    navigate(`/incidents/${notif.incidentId}`);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = severityConfig.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = notif.read ? "#1a2332" : severityConfig.color}
                >
                  <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                    {/* Unread indicator */}
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: notif.read ? "transparent" : severityConfig.color,
                      marginTop: "6px",
                      flexShrink: 0
                    }} />

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{
                          padding: "3px 8px",
                          background: `${severityConfig.color}20`,
                          color: severityConfig.color,
                          borderRadius: "3px",
                          fontSize: "9px",
                          fontWeight: 600
                        }}>
                          {notif.severity}
                        </span>
                        <span style={{
                          padding: "3px 8px",
                          background: `${statusConfig.color}20`,
                          color: statusConfig.color,
                          borderRadius: "3px",
                          fontSize: "9px",
                          fontWeight: 600
                        }}>
                          {statusConfig.label}
                        </span>
                        <span style={{ fontSize: "10px", color: "#7a8599", marginLeft: "auto" }}>
                          #{notif.incidentId}
                        </span>
                      </div>

                      {/* Title */}
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#e0e6f0", 
                        marginBottom: "6px",
                        fontWeight: notif.read ? 400 : 600,
                        lineHeight: 1.4
                      }}>
                        {notif.incidentName}
                      </div>

                      {/* Meta */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "10px", color: "#7a8599" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Shield size={10} />
                          {notif.deviceName}
                        </span>
                        <span>•</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={10} />
                          {timeAgo(notif.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <a
                        href={notif.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: "6px 10px",
                          background: "#0078d4",
                          border: "none",
                          borderRadius: "3px",
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <ExternalLink size={10} />
                        Defender
                      </a>

                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          style={{
                            padding: "6px 10px",
                            background: "#1a2332",
                            border: "1px solid #1a2332",
                            borderRadius: "3px",
                            color: "#7a8599",
                            fontSize: "9px",
                            cursor: "pointer"
                          }}
                        >
                          <CheckCircle size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
