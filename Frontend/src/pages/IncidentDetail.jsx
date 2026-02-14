import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE HOOK - SSR-SAFE
// ═══════════════════════════════════════════════════════════════

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// ═══════════════════════════════════════════════════════════════
// CONFIG — mirrors SOCDashboard exactly
// ═══════════════════════════════════════════════════════════════

const SEVERITY_CONFIG = {
  High:          { color: "#ff2055", glow: "#ff205540", label: "HIGH" },
  Medium:        { color: "#ff9900", glow: "#ff990030", label: "MED"  },
  Low:           { color: "#00d4ff", glow: "#00d4ff25", label: "LOW"  },
  Informational: { color: "#4a5568", glow: "#4a556820", label: "INFO" }
};

const STATUS_CONFIG = {
  New:      { color: "#ff2055", label: "NEW"      },
  Active:   { color: "#00d4ff", label: "ACTIVE"   },
  Resolved: { color: "#00ff9d", label: "RESOLVED" }
};

const CATEGORY_CONFIG = {
  Malware:            { color: "#ff2055", label: "Malware"            },
  Phishing:           { color: "#ff9900", label: "Phishing"           },
  SuspiciousActivity: { color: "#00d4ff", label: "Suspicious Activity"},
  UnwantedSoftware:   { color: "#a855f7", label: "Unwanted Software"  },
  MultiStagedAttack:  { color: "#ff00dd", label: "Multi-Stage Attack" },
  Ransomware:         { color: "#ff2055", label: "Ransomware"         },
  DataExfiltration:   { color: "#ff00dd", label: "Data Exfiltration"  },
  CredentialTheft:    { color: "#ff9900", label: "Credential Theft"   },
};

const DEVICES   = ["WS-FINANCE-001", "SRV-WEB-PROD", "WS-HR-042", "SRV-DC-01", "CFO-LAPTOP", "WS-DEV-12"];
const NAMES     = [
  "Suspicious PowerShell command line",
  "Multi-stage incident involving Ransomware",
  "Suspicious process injection detected",
  "Credential dumping activity detected",
  "Phishing email with malicious attachment",
  "Lateral movement via WMI",
  "Data exfiltration to external IP",
  "Malware persistence via registry"
];
const CATEGORIES = Object.keys(CATEGORY_CONFIG);

const ANALYST_EMAILS = [
  "sarah.chen@company.com",
  "mike.rodriguez@company.com",
  "emma.thompson@company.com",
  "james.park@company.com"
];

const seed = (n) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

const safeISO = (ms) => {
  const clamped = Math.max(0, Math.min(ms, 8640000000000000));
  const d = new Date(clamped);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

const generateMockIncident = (id) => {
  const stableId = Math.abs(id % 100000);
  const r  = seed(stableId);
  const r2 = seed(stableId + 99);
  const r3 = seed(stableId + 200);
  const r4 = seed(stableId + 300);
  const r5 = seed(stableId + 400);
  const r6 = seed(stableId + 500);
  const sevs  = ["High", "Medium", "Low", "Informational"];
  const stats = ["New", "Active", "Resolved"];
  const sev   = sevs[Math.abs(Math.floor(r  * sevs.length))  % sevs.length];
  const stat  = stats[Math.abs(Math.floor(r2 * stats.length)) % stats.length];
  const cat   = CATEGORIES[Math.abs(Math.floor(r3 * CATEGORIES.length)) % CATEGORIES.length];
  const dev   = DEVICES[Math.abs(Math.floor(r4 * DEVICES.length))       % DEVICES.length];
  const baseTime = Date.now() - Math.floor(r5 * 71) * 3600000;

  const alerts = [
    {
      alertId:           `da637293${id}-1647604418`,
      title:             "Suspicious command line activity",
      category:          cat,
      severity:          sev,
      status:            "New",
      serviceSource:     "MicrosoftDefenderForEndpoint",
      createdDateTime:   safeISO(baseTime),
      lastUpdateDateTime:safeISO(baseTime + r2 * 1800000),
      entities: [
        {
          entityType:         "Process",
          processId:          Math.floor(r4 * 9000) + 1000,
          fileName:           "powershell.exe",
          filePath:           "C:\\Windows\\System32\\WindowsPowerShell\\v1.0",
          processCommandLine: "powershell.exe -enc SQBFAFgAIAAoAG4AZQB3AC0AbwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8A...",
          sha256:             [...Array(64)].map((_,i) => seed(id+i*7).toString(16).substring(2,4)).join(""),
        },
        {
          entityType: "Ip",
          ipAddress:  `${Math.floor(r4*255)}.${Math.floor(r5*255)}.${Math.floor(r2*255)}.${Math.floor(r3*255)}`,
        }
      ],
      deviceId:           dev,
      userPrincipalName:  ["john.doe@company.com", "admin@company.com"][Math.floor(r4 * 2)],
      accountName:        ["john.doe", "admin", "svc.account"][Math.floor(r4 * 3)],
      mitreTechniques:    ["T1059.001", "T1055", "T1070.004"].slice(0, Math.floor(r5 * 3) + 1),
    }
  ];

  const comments = [
    {
      comment:   "Triaged. Malicious process confirmed. Initiating containment.",
      createdBy: ANALYST_EMAILS[0],
      createdTime: safeISO(baseTime + 900000)
    },
    {
      comment:   "SHA256 confirmed IOC match. Escalating per runbook.",
      createdBy: ANALYST_EMAILS[1],
      createdTime: safeISO(baseTime + 1800000)
    }
  ].slice(0, Math.max(1, Math.floor(r6 * 3)));

  return {
    incidentId:      id,
    incidentName:    NAMES[Math.floor(r * NAMES.length)],
    createdTime:     safeISO(baseTime),
    lastUpdateTime:  safeISO(baseTime + Math.floor(r6 * 7200000)),
    assignedTo:      stat !== "New" ? ANALYST_EMAILS[Math.floor(r3 * ANALYST_EMAILS.length)] : null,
    classification:  "TruePositive",
    determination:   cat,
    status:          stat,
    severity:        sev,
    alerts,
    comments,
    webUrl: `https://security.microsoft.com/incidents/${id}?tid=your-tenant-id`
  };
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function timeAgo(ts) {
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "—";
  const diff = Date.now() - date.getTime();
  const m  = Math.floor(diff / 60000);
  const h  = Math.floor(diff / 3600000);
  const dy = Math.floor(diff / 86400000);
  if (dy > 0) return `${dy}d`;
  if (h  > 0) return `${h}h`;
  return `${m}m`;
}

function fmtDateTime(ts) {
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// ═══════════════════════════════════════════════════════════════
// MOBILE COMPONENTS
// ═══════════════════════════════════════════════════════════════

function MobileHeader({ incident, onBack }) {
  const sev = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG["Informational"];
  const stat = STATUS_CONFIG[incident.status] ?? STATUS_CONFIG["New"];
  
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#040a16", borderBottom: "1px solid #090f1e"
    }}>
      {/* Color bar */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, ${sev.color}cc, ${sev.color}00)` }} />
      
      <div style={{ padding: "12px 16px" }}>
        {/* Back button + ID */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none",
              color: "#4a6a8a", cursor: "pointer",
              display: "flex", alignItems: "center",
              padding: "4px"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span style={{ fontSize: "11px", color: "#4a6a8a", fontWeight: 600 }}>#{incident.incidentId}</span>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          <div style={{ padding: "3px 8px", borderRadius: "4px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "9px", fontWeight: 700 }}>
            {sev.label}
          </div>
          <div style={{ padding: "3px 8px", borderRadius: "4px", background: `${stat.color}15`, border: `1px solid ${stat.color}35`, color: stat.color, fontSize: "9px", fontWeight: 700 }}>
            {stat.label}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#d0e8ff", lineHeight: 1.3, marginBottom: "8px" }}>
          {incident.incidentName}
        </h1>

        {/* Meta */}
        <div style={{ fontSize: "9px", color: "#2e4a65" }}>
          {fmtDateTime(incident.createdTime)}
        </div>
      </div>
    </div>
  );
}

function MobileInfoCard({ incident }) {
  const cat = CATEGORY_CONFIG[incident.determination] ?? { color: "#4a6a8a", label: incident.determination };
  const firstAlert = incident.alerts[0];
  
  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderRadius: "8px", padding: "16px", marginBottom: "12px"
    }}>
      <div style={{ fontSize: "9px", color: "#2e4a65", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Details
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "8px", color: "#2e4a65", marginBottom: "3px" }}>Category</div>
          <div style={{ fontSize: "11px", color: cat.color, fontWeight: 600 }}>{cat.label}</div>
        </div>
        <div>
          <div style={{ fontSize: "8px", color: "#2e4a65", marginBottom: "3px" }}>Device</div>
          <div style={{ fontSize: "11px", color: "#8aaccc", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {firstAlert?.deviceId || "—"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "8px", color: "#2e4a65", marginBottom: "3px" }}>Account</div>
          <div style={{ fontSize: "11px", color: "#8aaccc", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {firstAlert?.accountName || "—"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "8px", color: "#2e4a65", marginBottom: "3px" }}>Assigned</div>
          <div style={{ fontSize: "11px", color: incident.assignedTo ? "#8aaccc" : "#4a5568", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {incident.assignedTo ? incident.assignedTo.split("@")[0] : "Unassigned"}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG["Informational"];
  
  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderLeft: `3px solid ${sev.color}`,
      borderRadius: "8px", overflow: "hidden", marginBottom: "10px"
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "14px 16px", cursor: "pointer",
          display: "flex", alignItems: "flex-start", gap: "10px"
        }}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke={sev.color} strokeWidth="2.5"
          style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", marginTop: "2px", flexShrink: 0 }}
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <div style={{ padding: "2px 6px", borderRadius: "3px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700 }}>
              {sev.label}
            </div>
            <span style={{ fontSize: "8px", color: "#2e4a65" }}>{timeAgo(alert.createdDateTime)}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#b0cae6", fontWeight: 500, lineHeight: 1.4 }}>
            {alert.title}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #0d1928" }}>
          <div style={{ paddingTop: "12px" }}>
            <div style={{ fontSize: "8px", color: "#2e4a65", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Entities
            </div>
            {alert.entities?.map((e, i) => (
              <div key={i} style={{
                background: "#040a16", border: "1px solid #0d1928",
                borderRadius: "6px", padding: "10px", marginBottom: "6px"
              }}>
                <div style={{ fontSize: "8px", color: "#4a7090", marginBottom: "6px", fontWeight: 600 }}>
                  {e.entityType}
                </div>
                {e.fileName && (
                  <div style={{ fontSize: "10px", color: "#6a8aaa", marginBottom: "3px" }}>
                    {e.fileName}
                  </div>
                )}
                {e.ipAddress && (
                  <div style={{ fontSize: "10px", color: "#6a8aaa", marginBottom: "3px" }}>
                    {e.ipAddress}
                  </div>
                )}
                {e.processCommandLine && (
                  <div style={{ fontSize: "9px", color: "#3a5a78", marginTop: "6px", wordBreak: "break-all", lineHeight: 1.4 }}>
                    {e.processCommandLine.substring(0, 120)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCommentCard({ comment }) {
  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderRadius: "8px", padding: "12px", marginBottom: "10px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <div style={{
          width: "24px", height: "24px", borderRadius: "50%",
          background: "#0d1928", color: "#4a6a8a",
          fontSize: "9px", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {comment.createdBy.split("@")[0].substring(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", color: "#6a8aaa", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {comment.createdBy.split("@")[0]}
          </div>
          <div style={{ fontSize: "8px", color: "#2e4a65" }}>
            {timeAgo(comment.createdTime)}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "11px", color: "#8aaccc", lineHeight: 1.5 }}>
        {comment.comment}
      </div>
    </div>
  );
}

function MobileCommentInput({ onSubmit }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onSubmit({ type: "comment", text: draft.trim() });
    setDraft("");
  };

  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderRadius: "8px", padding: "12px", marginBottom: "12px"
    }}>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        style={{
          width: "100%", padding: "10px",
          background: "#040a16", border: "1px solid #0d1928",
          borderRadius: "6px", color: "#8aaccc", fontSize: "11px",
          outline: "none", resize: "vertical", fontFamily: "inherit",
          lineHeight: 1.5, marginBottom: "10px"
        }}
      />
      <button
        onClick={submit}
        disabled={!draft.trim()}
        style={{
          width: "100%", padding: "10px",
          background: draft.trim() ? "#00d4ff15" : "#0d1928",
          border: `1px solid ${draft.trim() ? "#00d4ff35" : "#0d1928"}`,
          borderRadius: "6px", color: draft.trim() ? "#00d4ff" : "#2e4a65",
          fontSize: "10px", fontWeight: 700,
          cursor: draft.trim() ? "pointer" : "not-allowed",
          fontFamily: "inherit"
        }}
      >
        Post Comment
      </button>
    </div>
  );
}

function MobileActionBar({ onAction }) {
  return (
    <div style={{
      position: "fixed", bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
      left: 0, right: 0,
      background: "#040a16", borderTop: "1px solid #090f1e",
      padding: "12px 16px",
      display: "flex", gap: "8px"
    }}>
      <button
        onClick={() => onAction("active")}
        style={{
          flex: 1, padding: "10px",
          background: "#ff990015", border: "1px solid #ff990035",
          borderRadius: "6px", color: "#ff9900",
          fontSize: "10px", fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}
      >
        Mark Active
      </button>
      <button
        onClick={() => onAction("resolved")}
        style={{
          flex: 1, padding: "10px",
          background: "#00ff9d15", border: "1px solid #00ff9d35",
          borderRadius: "6px", color: "#00ff9d",
          fontSize: "10px", fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}
      >
        Resolve
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP COMPONENTS (Original Preserved)
// ═══════════════════════════════════════════════════════════════

function Section({ title, children }) {
  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderRadius: "4px", overflow: "hidden"
    }}>
      <div style={{
        padding: "9px 14px", borderBottom: "1px solid #0d1928"
      }}>
        <span style={{ fontSize: "8px", fontWeight: 700, color: "#1e3a55", letterSpacing: "0.14em" }}>{title}</span>
      </div>
      <div style={{ padding: "14px" }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, value, color, mono }) {
  return (
    <div style={{
      display: "flex", gap: "12px", alignItems: "flex-start",
      padding: "6px 0", borderBottom: "1px solid #07101c"
    }}>
      <span style={{ fontSize: "8px", color: "#1a3050", letterSpacing: "0.1em", width: "110px", flexShrink: 0, marginTop: "1px", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{
        fontSize: mono ? "8px" : "10px", color: color || "#4a7090",
        flex: 1, wordBreak: "break-all", lineHeight: 1.5
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

function ActionBtn({ label, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 14px", borderRadius: "3px",
        background: disabled ? "transparent" : `${color}12`,
        border: `1px solid ${disabled ? "#0d1928" : color + "35"}`,
        color: disabled ? "#1a3050" : color,
        fontSize: "9px", fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
        letterSpacing: "0.06em", transition: "background 0.15s",
        fontFamily: "inherit", textAlign: "left", width: "100%"
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${color}22`; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = `${color}12`; }}
    >{label}</button>
  );
}

function DesktopAlertRow({ alert }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.Informational;

  return (
    <div style={{
      background: "#040a16", border: "1px solid #0d1928",
      borderLeft: `2px solid ${sev.color}`,
      borderRadius: "3px", overflow: "hidden"
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", cursor: "pointer"
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={sev.color} strokeWidth="2.5"
          style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <div style={{ padding: "1px 6px", borderRadius: "2px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700 }}>{sev.label}</div>
            <span style={{ fontSize: "8px", color: "#1e3a55" }}>{alert.serviceSource}</span>
            <span style={{ fontSize: "8px", color: "#1a3050", marginLeft: "auto" }}>{timeAgo(alert.createdDateTime)}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#b0cae6", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {alert.title}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 12px 12px", borderTop: "1px solid #0d1928", paddingTop: "12px" }}>
          <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.14em", marginBottom: "8px" }}>EVIDENCE / ENTITIES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {alert.entities?.map((e, i) => (
              <div key={i} style={{
                background: "#040a16", border: "1px solid #0d1928",
                borderRadius: "3px", padding: "10px"
              }}>
                <div style={{ fontSize: "8px", color: "#4a7090", marginBottom: "6px", fontWeight: 600 }}>
                  {e.entityType}
                </div>
                {e.fileName && <div style={{ fontSize: "9px", color: "#6a8aaa" }}>{e.fileName}</div>}
                {e.ipAddress && <div style={{ fontSize: "9px", color: "#6a8aaa" }}>{e.ipAddress}</div>}
                {e.processCommandLine && (
                  <div style={{ fontSize: "9px", color: "#3a5a78", marginTop: "6px", wordBreak: "break-all" }}>
                    {e.processCommandLine.substring(0, 200)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT - CONDITIONAL RENDER
// ═══════════════════════════════════════════════════════════════

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const numId = parseInt(id, 10);

  const [incident, setIncident] = useState(() => generateMockIncident(numId));
  const [statusLocal, setStatusLocal] = useState(null);

  const sev = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG["Informational"];
  const stat = STATUS_CONFIG[statusLocal || incident.status] ?? STATUS_CONFIG["New"];
  const cat = CATEGORY_CONFIG[incident.determination] ?? { color: "#4a6a8a", label: incident.determination };
  const firstAlert = incident.alerts[0];

  const handleAction = (action) => {
    if (action === "active") setStatusLocal("Active");
    if (action === "resolved") setStatusLocal("Resolved");
    
    // Handle comment submission
    if (action.type === "comment") {
      setIncident(prev => ({
        ...prev,
        comments: [...prev.comments, {
          comment: action.text,
          createdBy: "analyst@company.com",
          createdTime: new Date().toISOString()
        }]
      }));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ═══════════════════════════════════════════════════════════════

  if (isMobile) {
    return (
      <div style={{
        width: "100%", minHeight: "100%",
        background: "#050b17", color: "#c0d4ec",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        paddingBottom: "calc(130px + env(safe-area-inset-bottom, 0px))"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color: transparent; }
        `}</style>

        <MobileHeader incident={incident} onBack={() => navigate(-1)} />

        <div style={{ padding: "12px 16px" }}>
          <MobileInfoCard incident={incident} />

          {/* Alerts Section */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "9px", color: "#2e4a65", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Alerts ({incident.alerts.length})
            </div>
            {incident.alerts.map((a, i) => (
              <MobileAlertCard key={i} alert={a} />
            ))}
          </div>

          {/* Comments Section */}
          <div>
            <div style={{ fontSize: "9px", color: "#2e4a65", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Comments ({incident.comments.length})
            </div>
            {incident.comments.map((c, i) => (
              <MobileCommentCard key={i} comment={c} />
            ))}
            
            {/* Add Comment */}
            <MobileCommentInput onSubmit={handleAction} />
          </div>
        </div>

        <MobileActionBar onAction={handleAction} />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT (Original Preserved)
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#050b17", color: "#c0d4ec",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#111d30; border-radius:3px; }
      `}</style>

      {/* Desktop Header */}
      <header style={{
        height: "46px", display: "flex", alignItems: "center",
        padding: "0 18px", gap: "12px",
        background: "#040a16", borderBottom: "1px solid #090f1e"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,20 2,20" fill="none" stroke="#ff2055" strokeWidth="1.5"/>
            <polygon points="12,7 19,18 5,18" fill="#ff205512" stroke="#ff205528" strokeWidth="0.5"/>
            <circle cx="12" cy="16" r="1.5" fill="#ff2055"/>
            <line x1="12" y1="10" x2="12" y2="14" stroke="#ff2055" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#d0e8ff", letterSpacing: "0.06em", lineHeight: 1 }}>SOC SENTINEL</div>
            <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.2em", lineHeight: 1.4 }}>DEFENDER XDR</div>
          </div>
        </div>

        <div style={{ width: "1px", height: "18px", background: "#090f1e" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px" }}>
          <span style={{ color: "#2e4a65", cursor: "pointer" }} onClick={() => navigate(-1)}>Incidents</span>
          <span style={{ color: "#0d1928" }}>/</span>
          <span style={{ color: "#4a7090", fontWeight: 600 }}>#{incident.incidentId}</span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => window.open(incident.webUrl, "_blank")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 12px", borderRadius: "3px",
            background: "#6a8aaa12", border: "1px solid #6a8aaa30",
            color: "#6a8aaa", fontSize: "9px", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit"
          }}
        >
          Open in Defender ↗
        </button>
      </header>

      {/* Desktop Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "#040a16", borderBottom: "1px solid #090f1e" }}>
          <div style={{ height: "2px", background: `linear-gradient(90deg, ${sev.color}cc, ${sev.color}00)` }} />

          <div style={{ padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#1e3a55" }}>#{incident.incidentId}</span>
              <div style={{ padding: "2px 8px", borderRadius: "3px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700 }}>
                {sev.label}
              </div>
              <div style={{ padding: "2px 8px", borderRadius: "3px", background: `${stat.color}15`, border: `1px solid ${stat.color}35`, color: stat.color, fontSize: "8px", fontWeight: 700 }}>
                {stat.label}
              </div>
              <div style={{ padding: "2px 8px", borderRadius: "3px", background: `${cat.color}12`, border: `1px solid ${cat.color}30`, color: cat.color, fontSize: "8px", fontWeight: 600 }}>
                {cat.label}
              </div>
            </div>

            <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#d0e8ff", marginBottom: "8px" }}>
              {incident.incidentName}
            </h1>

            <div style={{ fontSize: "8px", color: "#1e3a55" }}>
              Created {fmtDateTime(incident.createdTime)} · {incident.alerts.length} alerts
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", gap: "14px" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
            <Section title="INCIDENT DETAILS">
              <FieldRow label="Severity" value={incident.severity} color={sev.color} />
              <FieldRow label="Status" value={statusLocal || incident.status} color={stat.color} />
              <FieldRow label="Category" value={cat.label} color={cat.color} />
              <FieldRow label="Device" value={firstAlert?.deviceId} />
              <FieldRow label="Account" value={firstAlert?.accountName} />
              <FieldRow label="Assigned" value={incident.assignedTo || "Unassigned"} />
            </Section>

            <Section title={`ALERTS (${incident.alerts.length})`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {incident.alerts.map((a, i) => <DesktopAlertRow key={i} alert={a} />)}
              </div>
            </Section>

            <Section title={`COMMENTS (${incident.comments.length})`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {incident.comments.map((c, i) => (
                  <div key={i} style={{
                    background: "#040a16", border: "1px solid #0d1928",
                    borderRadius: "4px", padding: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "#0d1928", color: "#4a6a8a",
                        fontSize: "8px", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {c.createdBy.split("@")[0].substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: "9px", color: "#4a7090", fontWeight: 600 }}>
                        {c.createdBy.split("@")[0]}
                      </span>
                      <span style={{ fontSize: "8px", color: "#2e4a65", marginLeft: "auto" }}>
                        {timeAgo(c.createdTime)}
                      </span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#5a7a9a", lineHeight: 1.5 }}>
                      {c.comment}
                    </div>
                  </div>
                ))}
                
                {/* Add comment input */}
                <div style={{ marginTop: "6px" }}>
                  <textarea
                    placeholder="Add a comment..."
                    rows={2}
                    style={{
                      width: "100%", padding: "8px 10px",
                      background: "#040a16", border: "1px solid #0d1928",
                      borderRadius: "3px", color: "#5a7a9a", fontSize: "10px",
                      outline: "none", resize: "vertical", fontFamily: "inherit",
                      lineHeight: 1.5, marginBottom: "8px"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey && e.target.value.trim()) {
                        handleAction({ type: "comment", text: e.target.value.trim() });
                        e.target.value = "";
                      }
                    }}
                  />
                  <div style={{ fontSize: "8px", color: "#1e3a55", fontStyle: "italic" }}>
                    Press Ctrl+Enter to post
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div style={{ width: "230px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <Section title="QUICK ACTIONS">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <ActionBtn label="Mark Active" color="#ff9900" onClick={() => setStatusLocal("Active")} disabled={statusLocal === "Active"} />
                <ActionBtn label="Mark Resolved" color="#00ff9d" onClick={() => setStatusLocal("Resolved")} disabled={statusLocal === "Resolved"} />
                <ActionBtn label="Open in Defender ↗" color="#6a8aaa" onClick={() => window.open(incident.webUrl, "_blank")} />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}