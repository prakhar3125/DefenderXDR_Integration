import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, User, Users,
  Search, Bell, RefreshCw, ChevronRight, ArrowUpRight, MessageSquare,
  Home, PieChart, Settings, LogOut, Volume2
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// CONFIG - BASED ON ACTUAL DEFENDER XDR API
// ═══════════════════════════════════════════════════════════════

const API_BASE = null; // Set to: https://graph.microsoft.com/v1.0

// ACTUAL Defender XDR severity levels (not Critical/Medium/Low - those don't exist!)
const SEVERITY_CONFIG = {
  High: { color: "#ff0844", icon: AlertTriangle, label: "High" },
  Medium: { color: "#ffaa00", icon: AlertTriangle, label: "Medium" },
  Low: { color: "#00d9ff", icon: AlertTriangle, label: "Low" },
  Informational: { color: "#7a8599", icon: AlertTriangle, label: "Informational" }
};

// ACTUAL Defender XDR status values
const STATUS_CONFIG = {
  New: { color: "#ff0844", icon: Bell, label: "New" },
  Active: { color: "#00d9ff", icon: AlertTriangle, label: "Active" },
  Resolved: { color: "#00ff88", icon: CheckCircle, label: "Resolved" }
};

// ACTUAL Defender XDR categories (from determination field)
const CATEGORY_CONFIG = {
  Malware: { color: "#ff0844", label: "Malware" },
  Phishing: { color: "#ff6b00", label: "Phishing" },
  SuspiciousActivity: { color: "#00d9ff", label: "Suspicious Activity" },
  UnwantedSoftware: { color: "#ffaa00", label: "Unwanted Software" },
  MultiStagedAttack: { color: "#ff00ff", label: "Multi-Stage Attack" }
};

const MOCK_ANALYSTS = [
  { email: "sarah.chen@company.com", name: "Sarah Chen", avatar: "SC", online: true },
  { email: "mike.rodriguez@company.com", name: "Mike Rodriguez", avatar: "MR", online: true },
  { email: "emma.thompson@company.com", name: "Emma Thompson", avatar: "ET", online: false },
  { email: "james.park@company.com", name: "James Park", avatar: "JP", online: true }
];

// Generate mock incident matching ACTUAL API structure
const generateMockIncident = (id) => {
  const severities = ["High", "Medium", "Low", "Informational"];
  const statuses = ["New", "Active", "Resolved"];
  const categories = ["Malware", "Phishing", "SuspiciousActivity", "UnwantedSoftware", "MultiStagedAttack"];
  
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    // ACTUAL API fields
    incidentId: id,
    incidentName: [
      "Suspicious PowerShell command line",
      "Multi-stage incident involving Ransomware",
      "Suspicious process injection",
      "Credential dumping activity detected",
      "Phishing email with malicious attachment"
    ][Math.floor(Math.random() * 5)],
    createdTime: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    lastUpdateTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    assignedTo: status !== "New" ? MOCK_ANALYSTS[Math.floor(Math.random() * MOCK_ANALYSTS.length)].email : null,
    classification: "TruePositive",
    determination: category,
    status: status,
    severity: severity,
    tags: ["Defender XDR"],
    alerts: [
      {
        alertId: `alert-${id}-001`,
        title: "Suspicious command line activity",
        category: category,
        severity: severity,
        serviceSource: "MicrosoftDefenderForEndpoint",
        entities: [
          {
            entityType: "Process",
            fileName: "powershell.exe",
            processCommandLine: "powershell.exe -enc SQBFAFgA...",
            sha256: "a1b2c3d4e5f6..."
          },
          {
            entityType: "Ip",
            ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          }
        ],
        deviceId: ["WS-FINANCE-001", "SRV-WEB-PROD", "WS-HR-042"][Math.floor(Math.random() * 3)],
        userPrincipalName: ["john.doe@company.com", "admin@company.com"][Math.floor(Math.random() * 2)],
        accountName: ["john.doe", "admin"][Math.floor(Math.random() * 2)]
      }
    ],
    comments: [],
    // CRITICAL: Deep link to Defender portal
    webUrl: `https://security.microsoft.com/incidents/${id}?tid=your-tenant-id`
  };
};

const MOCK_INCIDENTS = Array.from({ length: 50 }, (_, i) => generateMockIncident(924000 + i));

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION MANAGER (from your doc)
// ═══════════════════════════════════════════════════════════════

const NotificationManager = {
  async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  },

  playSound() {
    try {
      const audio = new Audio('data:audio/wav;base64,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');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  },

  show(incident) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 New Security Incident", {
        body: `${incident.incidentName} - Severity: ${incident.severity}`,
        tag: `incident-${incident.incidentId}`,
        requireInteraction: incident.severity === "High"
      });
    }
  },

  checkNewIncidents(incidents, lastCheckTime) {
    const newHigh = incidents.find(i => 
      i.severity === 'High' && 
      new Date(i.createdTime) > lastCheckTime &&
      i.status === 'New'
    );

    if (newHigh) {
      this.playSound();
      this.show(newHigh);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function MetricCard({ icon: Icon, label, value, trend, color = "#00d9ff", subtitle }) {
  return (
    <div style={{
      background: "#0a0e1a",
      border: "1px solid #1a2332",
      borderRadius: "4px",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ 
          width: "32px", 
          height: "32px", 
          borderRadius: "6px", 
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span style={{ fontSize: "10px", color: "#7a8599", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span style={{ fontSize: "24px", fontWeight: 700, color, fontFamily: "monospace" }}>
          {value}
        </span>
        {trend !== undefined && (
          <span style={{ 
            fontSize: "11px", 
            color: trend > 0 ? "#ff0844" : "#00ff88",
            display: "flex",
            alignItems: "center",
            gap: "2px"
          }}>
            {trend > 0 ? "↑" : "↓"}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subtitle && (
        <span style={{ fontSize: "9px", color: "#7a8599" }}>{subtitle}</span>
      )}
    </div>
  );
}

function IncidentCard({ incident, onClick }) {
  const severityConfig = SEVERITY_CONFIG[incident.severity];
  const statusConfig = STATUS_CONFIG[incident.status];
  const categoryConfig = CATEGORY_CONFIG[incident.determination];
  
  // Get first alert details (ACTUAL API structure)
  const firstAlert = incident.alerts[0];
  const deviceId = firstAlert?.deviceId || "Unknown";
  const userAccount = firstAlert?.accountName || "Unknown";
  
  const assignedAnalyst = MOCK_ANALYSTS.find(a => a.email === incident.assignedTo);
  
  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: "#0a0e1a",
        border: "1px solid #1a2332",
        borderRadius: "4px",
        padding: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
        borderLeft: `3px solid ${severityConfig.color}`
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2a3342"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a2332"}
    >
      <div style={{ display: "flex", alignItems: "start", gap: "8px", marginBottom: "8px" }}>
        <div style={{ 
          width: "6px", 
          height: "6px", 
          borderRadius: "50%", 
          background: severityConfig.color,
          marginTop: "6px",
          animation: incident.status === "New" ? "pulse 2s infinite" : "none"
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#e0e6f0", fontFamily: "monospace" }}>
              #{incident.incidentId}
            </span>
            <span style={{
              padding: "2px 6px",
              background: `${severityConfig.color}20`,
              color: severityConfig.color,
              borderRadius: "2px",
              fontSize: "9px",
              fontWeight: 600
            }}>
              {incident.severity}
            </span>
            <span style={{
              padding: "2px 6px",
              background: `${statusConfig.color}20`,
              color: statusConfig.color,
              borderRadius: "2px",
              fontSize: "9px",
              fontWeight: 600
            }}>
              {statusConfig.label}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#e0e6f0", marginBottom: "6px", lineHeight: 1.4 }}>
            {incident.incidentName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "10px", color: "#7a8599" }}>
            <span>{categoryConfig?.label || incident.determination}</span>
            <span>•</span>
            <span>{deviceId}</span>
            <span>•</span>
            <span>{userAccount}</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={10} />
              {timeAgo(incident.createdTime)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingTop: "8px",
        borderTop: "1px solid #1a2332"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {assignedAnalyst ? (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#00d9ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                fontWeight: 600,
                color: "#000"
              }}>
                {assignedAnalyst.avatar}
              </div>
              <span style={{ fontSize: "10px", color: "#7a8599" }}>{assignedAnalyst.name}</span>
            </div>
          ) : (
            <span style={{ fontSize: "10px", color: "#7a8599", fontStyle: "italic" }}>Unassigned</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {incident.comments.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "#7a8599" }}>
              <MessageSquare size={11} />
              {incident.comments.length}
            </span>
          )}
          <ChevronRight size={14} style={{ color: "#7a8599" }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

export default function SOCDashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Request notification permission on mount
  useEffect(() => {
    NotificationManager.requestPermission();
  }, []);

  // Auto-refresh (simulates polling Microsoft Graph API)
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // In production: 
      // const response = await fetch(`${API_BASE}/security/incidents`);
      // const data = await response.json();
      // setIncidents(data.value);
      
      if (Math.random() > 0.7) {
        const newIncident = generateMockIncident(Date.now());
        setIncidents(prev => [newIncident, ...prev]);
        
        if (soundEnabled) {
          NotificationManager.checkNewIncidents([newIncident], lastCheckTime);
        }
        setLastCheckTime(new Date());
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, lastCheckTime, soundEnabled]);

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchSearch = incident.incidentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       incident.incidentId.toString().includes(searchTerm) ||
                       incident.alerts[0]?.deviceId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeverity = filterSeverity === "ALL" || incident.severity === filterSeverity;
    const matchStatus = filterStatus === "ALL" || incident.status === filterStatus;
    return matchSearch && matchSeverity && matchStatus;
  });

  // Metrics
  const metrics = {
    total: incidents.length,
    new: incidents.filter(i => i.status === "New").length,
    high: incidents.filter(i => i.severity === "High").length,
    resolved: incidents.filter(i => i.status === "Resolved").length,
    activeAnalysts: MOCK_ANALYSTS.filter(a => a.online).length
  };

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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1a2332; border-radius: 4px; }
        ::selection { background: #00d9ff; color: #000; }
      `}</style>



      {/* Metrics */}
      <div style={{
        padding: "16px 20px",
        background: "#0a0e1a",
        borderBottom: "1px solid #1a2332"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px"
        }}>
          <MetricCard icon={Bell} label="Total Incidents" value={metrics.total} trend={12} color="#00d9ff" subtitle="Last 24 hours" />
          <MetricCard icon={AlertTriangle} label="New Incidents" value={metrics.new} trend={5} color="#ff0844" subtitle="Needs attention" />
          <MetricCard icon={Shield} label="High Severity" value={metrics.high} trend={-8} color="#ff6b00" subtitle="Active" />
          <MetricCard icon={CheckCircle} label="Resolved" value={metrics.resolved} trend={15} color="#00ff88" subtitle="Today" />
          <MetricCard icon={Users} label="Active Analysts" value={metrics.activeAnalysts} color="#00d9ff" subtitle={`of ${MOCK_ANALYSTS.length}`} />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        padding: "12px 20px",
        background: "#0a0e1a",
        borderBottom: "1px solid #1a2332",
        display: "flex",
        gap: "12px",
        alignItems: "center"
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#7a8599" }} />
          <input
            type="text"
            placeholder="Search by ID, name, device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 8px 8px 36px",
              background: "#050810",
              border: "1px solid #1a2332",
              borderRadius: "4px",
              color: "#e0e6f0",
              fontSize: "11px"
            }}
          />
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "#050810",
            border: "1px solid #1a2332",
            borderRadius: "4px",
            color: "#e0e6f0",
            fontSize: "11px"
          }}
        >
          <option value="ALL">All Severities</option>
          {Object.keys(SEVERITY_CONFIG).map(sev => (
            <option key={sev} value={sev}>{SEVERITY_CONFIG[sev].label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            background: "#050810",
            border: "1px solid #1a2332",
            borderRadius: "4px",
            color: "#e0e6f0",
            fontSize: "11px"
          }}
        >
          <option value="ALL">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(status => (
            <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
          ))}
        </select>

        <div style={{
          padding: "8px 12px",
          background: "#050810",
          border: "1px solid #1a2332",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#7a8599"
        }}>
          {filteredIncidents.length} results
        </div>
      </div>

      {/* Incident List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {filteredIncidents.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#7a8599"
          }}>
            <Shield size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <div style={{ fontSize: "13px" }}>No incidents match your filters</div>
          </div>
        ) : (
          filteredIncidents.map(incident => (
            <IncidentCard
              key={incident.incidentId}
              incident={incident}
              onClick={() => navigate(`/incidents/${incident.incidentId}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
