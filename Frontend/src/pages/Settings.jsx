import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Settings as SettingsIcon, Bell, Users, Database, Lock,
  Home, PieChart, LogOut, Save, RefreshCw, AlertTriangle, CheckCircle,
  Globe, Mail, Smartphone, Server, Key, Eye, Zap, Clock
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "users", label: "Users & Access", icon: Users },
    { id: "integration", label: "Integration", icon: Database },
    { id: "security", label: "Security", icon: Lock }
  ];

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#050810",
      color: "#e0e6f0",
      fontFamily: "monospace",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1a2332; border-radius: 4px; }
        ::selection { background: #00d9ff; color: #000; }
      `}</style>


      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar Tabs */}
        <div style={{
          width: "240px",
          background: "#0a0e1a",
          borderRight: "1px solid #1a2332",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px",
                  background: isActive ? "#00d9ff20" : "transparent",
                  border: `1px solid ${isActive ? "#00d9ff" : "transparent"}`,
                  borderRadius: "4px",
                  color: isActive ? "#00d9ff" : "#7a8599",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "left",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#1a2332";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {activeTab === "general" && (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "#e0e6f0" }}>
                General Settings
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                {/* Organization */}
                <div style={{
                  background: "#0a0e1a",
                  border: "1px solid #1a2332",
                  borderRadius: "6px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff" }}>
                    Organization Details
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#7a8599", marginBottom: "6px" }}>
                        Organization Name
                      </label>
                      <input
                        type="text"
                        defaultValue="SecureOps Inc."
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#050810",
                          border: "1px solid #1a2332",
                          borderRadius: "4px",
                          color: "#e0e6f0",
                          fontSize: "11px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#7a8599", marginBottom: "6px" }}>
                        Time Zone
                      </label>
                      <select
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#050810",
                          border: "1px solid #1a2332",
                          borderRadius: "4px",
                          color: "#e0e6f0",
                          fontSize: "11px"
                        }}
                      >
                        <option>UTC</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                        <option>Asia/Tokyo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Auto-Refresh */}
                <div style={{
                  background: "#0a0e1a",
                  border: "1px solid #1a2332",
                  borderRadius: "6px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff" }}>
                    Auto-Refresh Settings
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "#00d9ff" }} />
                    <span style={{ fontSize: "11px", color: "#e0e6f0" }}>
                      Enable automatic alert refresh
                    </span>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ display: "block", fontSize: "10px", color: "#7a8599", marginBottom: "6px" }}>
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      style={{
                        width: "100px",
                        padding: "8px",
                        background: "#050810",
                        border: "1px solid #1a2332",
                        borderRadius: "4px",
                        color: "#e0e6f0",
                        fontSize: "11px"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "#e0e6f0" }}>
                Notification Preferences
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <div style={{
                  background: "#0a0e1a",
                  border: "1px solid #1a2332",
                  borderRadius: "6px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff" }}>
                    Alert Notifications
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { severity: "Critical", icon: AlertTriangle, color: "#ff0844" },
                      { severity: "High", icon: AlertTriangle, color: "#ff6b00" },
                      { severity: "Medium", icon: AlertTriangle, color: "#ffaa00" },
                      { severity: "Low", icon: AlertTriangle, color: "#00d9ff" }
                    ].map(item => (
                      <div key={item.severity} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px",
                        background: "#050810",
                        border: "1px solid #1a2332",
                        borderRadius: "4px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <item.icon size={14} style={{ color: item.color }} />
                          <span style={{ fontSize: "11px", color: "#e0e6f0" }}>{item.severity} Alerts</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#7a8599" }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: "#00d9ff" }} />
                            <Mail size={12} />
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#7a8599" }}>
                            <input type="checkbox" defaultChecked={item.severity !== "Low"} style={{ accentColor: "#00d9ff" }} />
                            <Smartphone size={12} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integration" && (
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "#e0e6f0" }}>
                Integration Settings
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <div style={{
                  background: "#0a0e1a",
                  border: "1px solid #1a2332",
                  borderRadius: "6px",
                  padding: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#00d9ff" }}>
                      Windows Defender XDR
                    </h3>
                    <span style={{
                      padding: "3px 8px",
                      background: "rgba(0, 255, 136, 0.2)",
                      color: "#00ff88",
                      borderRadius: "3px",
                      fontSize: "9px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <CheckCircle size={10} />
                      Connected
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#7a8599", marginBottom: "12px" }}>
                    Real-time threat detection and response integration
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#7a8599", marginBottom: "6px" }}>
                        API Endpoint
                      </label>
                      <input
                        type="text"
                        defaultValue="https://api.securitycenter.microsoft.com"
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#050810",
                          border: "1px solid #1a2332",
                          borderRadius: "4px",
                          color: "#e0e6f0",
                          fontSize: "11px",
                          fontFamily: "monospace"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#7a8599", marginBottom: "6px" }}>
                        API Key
                      </label>
                      <input
                        type="password"
                        defaultValue="sk_live_xxxxxxxxxxxxxxxxxx"
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: "#050810",
                          border: "1px solid #1a2332",
                          borderRadius: "4px",
                          color: "#e0e6f0",
                          fontSize: "11px",
                          fontFamily: "monospace"
                        }}
                      />
                    </div>
                    <button
                      style={{
                        padding: "8px 16px",
                        background: "#1a2332",
                        border: "1px solid #1a2332",
                        borderRadius: "4px",
                        color: "#7a8599",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        alignSelf: "flex-start"
                      }}
                    >
                      <RefreshCw size={12} />
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {saved && (
            <div style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "rgba(0, 255, 136, 0.2)",
              border: "1px solid #00ff88",
              borderRadius: "6px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#00ff88",
              fontSize: "12px",
              fontWeight: 600
            }}>
              <CheckCircle size={16} />
              Settings saved successfully
            </div>
          )}

          <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px"
          }}>
            <button
              onClick={handleSave}
              style={{
                padding: "12px 24px",
                background: "#00d9ff",
                border: "none",
                borderRadius: "6px",
                color: "#000",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0, 217, 255, 0.3)"
              }}
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
