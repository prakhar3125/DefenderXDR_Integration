import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// CONFIG — mirrors SOCDashboard exactly (Actual Defender XDR API)
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

const HIGH_VALUE_DEVICES = ["SRV-DC-01", "SRV-WEB-PROD", "CFO-LAPTOP", "SRV-BACKUP"];
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

// Safe helper — clamps ms to a valid Date range and returns ISO string
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
  const isHV  = HIGH_VALUE_DEVICES.includes(dev);
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
          parentProcessId:    Math.floor(r3 * 9000) + 1000,
          parentFileName:     "explorer.exe",
        },
        {
          entityType: "Ip",
          ipAddress:  `${Math.floor(r4*255)}.${Math.floor(r5*255)}.${Math.floor(r2*255)}.${Math.floor(r3*255)}`,
        },
        {
          entityType: "File",
          fileName:   "payload.dll",
          filePath:   "C:\\Users\\Public\\Downloads\\payload.dll",
          sha256:     `d4e5f6a7b8${seed(id+99).toString(16).substring(2,10)}...`,
        },
        {
          entityType:       "User",
          accountName:      ["john.doe", "admin", "svc.account", "m.smith"][Math.floor(r4 * 4)],
          userPrincipalName:["john.doe@company.com", "admin@company.com"][Math.floor(r4 * 2)],
          domainName:       "CORP",
        }
      ],
      deviceId:           dev,
      userPrincipalName:  ["john.doe@company.com", "admin@company.com"][Math.floor(r4 * 2)],
      accountName:        ["john.doe", "admin", "svc.account", "m.smith"][Math.floor(r4 * 4)],
      mitreTechniques:    ["T1059.001", "T1055", "T1070.004"].slice(0, Math.floor(r5 * 3) + 1),
    },
    ...(r6 > 0.4 ? [{
      alertId:            `da637293${id}-2847291847`,
      title:             "Credential access via LSASS memory read",
      category:          "CredentialTheft",
      severity:          sev,
      status:            "InProgress",
      serviceSource:     "MicrosoftDefenderForEndpoint",
      createdDateTime:   safeISO(baseTime + r2 * 900000),
      lastUpdateDateTime:safeISO(baseTime + r3 * 3600000),
      entities: [
        {
          entityType: "Process",
          fileName:   "lsass.exe",
          filePath:   "C:\\Windows\\System32",
          processId:  Math.floor(r3 * 9000) + 1000,
        }
      ],
      deviceId:          dev,
      userPrincipalName: ["john.doe@company.com", "admin@company.com"][Math.floor(r4 * 2)],
      accountName:       "SYSTEM",
      mitreTechniques:   ["T1003.001"],
    }] : []),
  ];

  const comments = [
    {
      comment:   "Triaged. Malicious process confirmed on endpoint. Initiating containment.",
      createdBy: ANALYST_EMAILS[0],
      createdTime: safeISO(baseTime + 900000)
    },
    {
      comment:   "SHA256 confirmed IOC match in TI database. Escalating per runbook.",
      createdBy: ANALYST_EMAILS[1],
      createdTime: safeISO(baseTime + 1800000)
    },
    {
      comment:   "No lateral movement detected. Isolated host. Ticket opened for reimaging.",
      createdBy: ANALYST_EMAILS[0],
      createdTime: safeISO(baseTime + 3600000)
    }
  ].slice(0, Math.max(1, Math.floor(r6 * 4)));

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
    isHighValue:     isHV,
    tags:            isHV ? ["HighValue", "Defender XDR"] : ["Defender XDR"],
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
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

// ═══════════════════════════════════════════════════════════════
// SMALL SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Section({ title, children, action }) {
  return (
    <div style={{
      background: "#060c19", border: "1px solid #0d1928",
      borderRadius: "4px", overflow: "hidden"
    }}>
      <div style={{
        padding: "9px 14px", borderBottom: "1px solid #0d1928",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <span style={{ fontSize: "8px", fontWeight: 700, color: "#1e3a55", letterSpacing: "0.14em" }}>{title}</span>
        {action}
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
        flex: 1, wordBreak: "break-all", lineHeight: 1.5,
        fontFamily: mono ? "inherit" : "inherit"
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

// ═══════════════════════════════════════════════════════════════
// ENTITY CARD
// ═══════════════════════════════════════════════════════════════

const ENTITY_DISPLAY = {
  Process: { color: "#ff9900", icon: "▶", label: "PROCESS" },
  Ip:      { color: "#00d4ff", icon: "⬡", label: "IP ADDRESS" },
  File:    { color: "#a855f7", icon: "◈", label: "FILE" },
  User:    { color: "#00ff9d", icon: "◎", label: "USER ACCOUNT" },
};

function EntityCard({ entity }) {
  const cfg = ENTITY_DISPLAY[entity.entityType] || { color: "#4a6a8a", icon: "○", label: entity.entityType?.toUpperCase() };

  const fields = [];
  // Process
  if (entity.fileName && entity.entityType === "Process") fields.push(["Image",    entity.fileName]);
  if (entity.filePath && entity.entityType === "Process") fields.push(["Path",     entity.filePath]);
  if (entity.processCommandLine)                          fields.push(["CmdLine",  entity.processCommandLine]);
  if (entity.processId)                                   fields.push(["PID",      String(entity.processId)]);
  if (entity.parentFileName)                              fields.push(["Parent",   entity.parentFileName]);
  if (entity.sha256 && entity.entityType === "Process")   fields.push(["SHA256",   entity.sha256]);
  // IP
  if (entity.ipAddress)                                   fields.push(["Address",  entity.ipAddress]);
  // File
  if (entity.fileName && entity.entityType === "File")    fields.push(["Name",     entity.fileName]);
  if (entity.filePath && entity.entityType === "File")    fields.push(["Path",     entity.filePath]);
  if (entity.sha256 && entity.entityType === "File")      fields.push(["SHA256",   entity.sha256]);
  // User
  if (entity.accountName)                                 fields.push(["Account",  entity.accountName]);
  if (entity.userPrincipalName)                           fields.push(["UPN",      entity.userPrincipalName]);
  if (entity.domainName)                                  fields.push(["Domain",   entity.domainName]);

  return (
    <div style={{
      background: "#040a16",
      border: `1px solid ${cfg.color}20`,
      borderLeft: `2px solid ${cfg.color}`,
      borderRadius: "3px", padding: "10px 12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
        <span style={{ fontSize: "11px", color: cfg.color }}>{cfg.icon}</span>
        <span style={{ fontSize: "8px", fontWeight: 700, color: cfg.color, letterSpacing: "0.12em" }}>{cfg.label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {fields.map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.1em", width: "52px", flexShrink: 0, marginTop: "2px", textTransform: "uppercase" }}>{k}</span>
            <span style={{ fontSize: "9px", color: "#3a5a78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={v}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALERT ROW
// ═══════════════════════════════════════════════════════════════

function AlertRow({ alert }) {
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
          padding: "10px 12px", cursor: "pointer",
          userSelect: "none"
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={sev.color} strokeWidth="2.5"
          style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <div style={{ padding: "1px 6px", borderRadius: "2px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700 }}>{sev.label}</div>
            <span style={{ fontSize: "8px", color: "#1e3a55", fontFamily: "inherit" }}>{alert.serviceSource}</span>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
            {alert.entities.map((e, i) => <EntityCard key={i} entity={e} />)}
          </div>
          {alert.mitreTechniques?.length > 0 && (
            <div>
              <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.14em", marginBottom: "6px" }}>MITRE ATT&CK TECHNIQUES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {alert.mitreTechniques.map(t => (
                  <a key={t} href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`} target="_blank" rel="noreferrer"
                    style={{ padding: "2px 8px", background: "#0d1928", border: "1px solid #1e3a55", borderRadius: "2px", fontSize: "9px", color: "#4a7090", textDecoration: "none", letterSpacing: "0.04em" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#00d4ff"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4a7090"}
                  >{t}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMMENT THREAD
// ═══════════════════════════════════════════════════════════════

function CommentThread({ comments, onAdd }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {comments.length === 0 && (
        <div style={{ fontSize: "10px", color: "#1e3a55", fontStyle: "italic" }}>No comments yet.</div>
      )}
      {comments.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "3px",
            background: "#0d1928", border: "1px solid #1e3a55",
            color: "#3a5a78", fontSize: "8px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, letterSpacing: "0.04em"
          }}>
            {c.createdBy?.split("@")[0]?.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "9px", color: "#3a5a78", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.createdBy}
              </span>
              <span style={{ fontSize: "8px", color: "#1e3a55", flexShrink: 0 }}>{timeAgo(c.createdTime)}</span>
            </div>
            <div style={{
              fontSize: "10px", color: "#3a5a78", lineHeight: 1.55,
              background: "#040a16", padding: "8px 10px",
              borderRadius: "3px", border: "1px solid #0d1928"
            }}>
              {c.comment}
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", paddingTop: "4px", borderTop: "1px solid #07101c" }}>
        <div style={{ flex: 1 }}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) submit(); }}
            placeholder="Add a comment… (Ctrl+Enter to post)"
            rows={2}
            style={{
              width: "100%", padding: "8px 10px",
              background: "#040a16", border: "1px solid #0d1928",
              borderRadius: "3px", color: "#5a7a9a", fontSize: "10px",
              outline: "none", resize: "vertical", fontFamily: "inherit",
              lineHeight: 1.5, minHeight: "52px"
            }}
            onFocus={e  => e.target.style.borderColor = "#1e3a55"}
            onBlur={e   => e.target.style.borderColor = "#0d1928"}
          />
        </div>
        <button
          onClick={submit}
          style={{
            padding: "8px 14px", borderRadius: "3px",
            background: "#00d4ff12", border: "1px solid #00d4ff30",
            color: "#00d4ff", fontSize: "9px", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.06em",
            fontFamily: "inherit", transition: "background 0.15s",
            alignSelf: "flex-end", flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#00d4ff22"}
          onMouseLeave={e => e.currentTarget.style.background = "#00d4ff12"}
        >POST</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLA BAR (matching SOCDashboard)
// ═══════════════════════════════════════════════════════════════

function SlaBar({ incident }) {
  const slaHours = { High: 1, Medium: 4, Low: 24, Informational: 72 };
  const hours    = slaHours[incident.severity];
  const elapsed  = (Date.now() - new Date(incident.createdTime).getTime()) / 3600000;
  const pct      = Math.min((elapsed / hours) * 100, 100);
  const color    = pct > 90 ? "#ff2055" : pct > 60 ? "#ff9900" : "#00ff9d";
  const slaLeft  = Math.max(0, hours - elapsed);
  
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "8px", color: "#1e3a55" }}>{Math.round(pct)}% used</span>
        <span style={{ fontSize: "8px", color, fontWeight: 600 }}>
          {pct >= 100 ? "BREACHED" : `${slaLeft.toFixed(1)}h left`}
        </span>
      </div>
      <div style={{ height: "5px", background: "#0d1928", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: color,
          boxShadow: pct > 90 ? `0 0 8px ${color}` : "none",
          transition: "width 0.3s"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#1a3050", marginTop: "5px" }}>
        <span>Window: {hours}h</span>
        <span>Severity: {incident.severity}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN INCIDENT DETAIL PAGE
// ═══════════════════════════════════════════════════════════════

const TABS = [
  { id: "overview",  label: "OVERVIEW"  },
  { id: "alerts",    label: "ALERTS"    },
  { id: "entities",  label: "ENTITIES"  },
];

export default function IncidentDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const numId    = parseInt(id, 10);

  const [incident, setIncident]       = useState(() => generateMockIncident(numId));
  const [activeTab, setActiveTab]     = useState("overview");
  const [statusLocal, setStatusLocal] = useState(null);

  const sev  = SEVERITY_CONFIG[incident.severity]  ?? SEVERITY_CONFIG["Informational"];
  const stat = STATUS_CONFIG[statusLocal || incident.status] ?? STATUS_CONFIG["New"];
  const cat  = CATEGORY_CONFIG[incident.determination] ?? { color: "#4a6a8a", label: incident.determination };
  const firstAlert = incident.alerts[0];

  const allEntities = incident.alerts.flatMap(a => a.entities || []);
  const uniqueEntities = allEntities.reduce((acc, e) => {
    const key = `${e.entityType}-${e.ipAddress || e.fileName || e.accountName || e.processId}`;
    if (!acc.find(x => `${x.entityType}-${x.ipAddress || x.fileName || x.accountName || x.processId}` === key)) acc.push(e);
    return acc;
  }, []);

  const addComment = (text) => {
    setIncident(prev => ({
      ...prev,
      comments: [...prev.comments, {
        comment:    text,
        createdBy:  "analyst@company.com",
        createdTime: new Date().toISOString()
      }]
    }));
  };

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#050b17", color: "#c0d4ec",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#111d30; border-radius:3px; }
        input, select, button, textarea { font-family:inherit; }
        textarea::placeholder { color:#111d30; }
        a { text-decoration:none; }
      `}</style>

      {/* ══ TOP NAV (matching SOCDashboard style) ══ */}
      <header style={{
        height: "46px", display: "flex", alignItems: "center",
        padding: "0 18px", gap: "12px",
        background: "#040a16", borderBottom: "1px solid #090f1e",
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginRight: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,20 2,20" fill="none" stroke="#ff2055" strokeWidth="1.5"/>
            <polygon points="12,7 19,18 5,18"  fill="#ff205512" stroke="#ff205528" strokeWidth="0.5"/>
            <circle cx="12" cy="16" r="1.5" fill="#ff2055"/>
            <line x1="12" y1="10" x2="12" y2="14" stroke="#ff2055" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#d0e8ff", letterSpacing: "0.06em", lineHeight: 1 }}>SOC SENTINEL</div>
            <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.2em", lineHeight: 1.4 }}>DEFENDER XDR</div>
          </div>
        </div>

        <div style={{ width: "1px", height: "18px", background: "#090f1e" }} />

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px" }}>
          <span style={{ color: "#2e4a65", cursor: "pointer" }} onClick={() => navigate(-1)}>Incidents</span>
          <span style={{ color: "#0d1928" }}>/</span>
          <span style={{ color: "#4a7090", fontWeight: 600 }}>#{incident.incidentId}</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Open in Defender portal */}
        <button
          onClick={() => window.open(incident.webUrl, "_blank")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 12px", borderRadius: "3px",
            background: "#6a8aaa12", border: "1px solid #6a8aaa30",
            color: "#6a8aaa", fontSize: "9px", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.06em",
            fontFamily: "inherit", transition: "background 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#6a8aaa20"}
          onMouseLeave={e => e.currentTarget.style.background = "#6a8aaa12"}
        >
          Open in Defender ↗
        </button>
      </header>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ══ INCIDENT HERO HEADER ══ */}
        <div style={{
          background: "#040a16", borderBottom: "1px solid #090f1e",
          animation: "fadeIn 0.2s ease"
        }}>
          {/* Severity color bar */}
          <div style={{ height: "2px", background: `linear-gradient(90deg, ${sev.color}cc, ${sev.color}00)` }} />

          <div style={{ padding: "14px 20px" }}>
            {/* Badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "9px", color: "#1e3a55" }}>#{incident.incidentId}</span>

              <div style={{ padding: "2px 8px", borderRadius: "3px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em" }}>
                {sev.label}
              </div>

              <div style={{
                padding: "2px 8px", borderRadius: "3px",
                background: `${stat.color}15`, border: `1px solid ${stat.color}35`,
                color: stat.color, fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em",
                display: "inline-flex", alignItems: "center", gap: "4px"
              }}>
                {(statusLocal || incident.status) === "New" && (
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: stat.color, animation: "pulse 1.8s infinite" }} />
                )}
                {stat.label}
              </div>

              {incident.isHighValue && (
                <div style={{ padding: "2px 8px", borderRadius: "3px", background: "#ff990015", border: "1px solid #ff990035", color: "#ff9900", fontSize: "8px", fontWeight: 700 }}>
                  ⬡ HIGH-VALUE ASSET
                </div>
              )}

              {cat && (
                <div style={{ padding: "2px 8px", borderRadius: "3px", background: `${cat.color}12`, border: `1px solid ${cat.color}30`, color: cat.color, fontSize: "8px", fontWeight: 600 }}>
                  {cat.label}
                </div>
              )}

              {incident.tags?.map(t => (
                <span key={t} style={{ padding: "1px 6px", background: "#0d1928", border: "1px solid #111d30", borderRadius: "2px", fontSize: "8px", color: "#2e4a65" }}>{t}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#d0e8ff", letterSpacing: "0.02em", lineHeight: 1.25, marginBottom: "8px" }}>
              {incident.incidentName}
            </h1>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "8px", color: "#1e3a55", marginBottom: "14px", flexWrap: "wrap" }}>
              <span>Created {fmtDateTime(incident.createdTime)}</span>
              <span style={{ color: "#090f1e" }}>·</span>
              <span>Updated {timeAgo(incident.lastUpdateTime)}</span>
              <span style={{ color: "#090f1e" }}>·</span>
              <span>{incident.alerts.length} alert{incident.alerts.length !== 1 ? "s" : ""}</span>
              <span style={{ color: "#090f1e" }}>·</span>
              <span>{uniqueEntities.length} entities</span>
              {incident.assignedTo && (
                <>
                  <span style={{ color: "#090f1e" }}>·</span>
                  <span>Assigned: <span style={{ color: "#3a5a78" }}>{incident.assignedTo}</span></span>
                </>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0", borderTop: "1px solid #090f1e" }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 18px",
                    background: "transparent", border: "none",
                    borderBottom: `2px solid ${activeTab === tab.id ? sev.color : "transparent"}`,
                    color: activeTab === tab.id ? sev.color : "#1e3a55",
                    fontSize: "9px", fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.1em",
                    transition: "all 0.15s", fontFamily: "inherit"
                  }}
                  onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "#2e4a65"; }}
                  onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = "#1e3a55"; }}
                >
                  {tab.label}
                  {tab.id === "alerts"   && <span style={{ marginLeft: "5px", fontSize: "7px", opacity: 0.6 }}>{incident.alerts.length}</span>}
                  {tab.id === "entities" && <span style={{ marginLeft: "5px", fontSize: "7px", opacity: 0.6 }}>{uniqueEntities.length}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY: 2-COLUMN LAYOUT ══ */}
        <div style={{ padding: "16px 20px", display: "flex", gap: "14px" }}>

          {/* ── MAIN COLUMN ── */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                <Section title="INCIDENT DETAILS">
                  <FieldRow label="Incident ID"     value={String(incident.incidentId)} />
                  <FieldRow label="Severity"        value={incident.severity}         color={sev.color} />
                  <FieldRow label="Status"          value={statusLocal || incident.status} color={stat.color} />
                  <FieldRow label="Classification"  value={incident.classification}   color="#00d4ff" />
                  <FieldRow label="Determination"   value={cat?.label || incident.determination} color={cat?.color} />
                  <FieldRow label="Assigned To"     value={incident.assignedTo || "Unassigned"} color={incident.assignedTo ? "#4a7090" : "#1e3a55"} />
                  <FieldRow label="Device"          value={firstAlert?.deviceId} />
                  <FieldRow label="Account"         value={firstAlert?.accountName} />
                  <FieldRow label="UPN"             value={firstAlert?.userPrincipalName} />
                  <FieldRow label="Created"         value={fmtDateTime(incident.createdTime)} />
                  <FieldRow label="Last Updated"    value={fmtDateTime(incident.lastUpdateTime)} />
                </Section>

                <Section title={`ANALYST COMMENTS (${incident.comments.length})`}>
                  <CommentThread comments={incident.comments} onAdd={addComment} />
                </Section>
              </>
            )}

            {/* ALERTS TAB */}
            {activeTab === "alerts" && (
              <Section title={`ALERTS (${incident.alerts.length})`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {incident.alerts.map((a, i) => <AlertRow key={i} alert={a} />)}
                </div>
              </Section>
            )}

            {/* ENTITIES TAB */}
            {activeTab === "entities" && (
              <Section title={`ENTITIES (${uniqueEntities.length})`}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {uniqueEntities.length === 0
                    ? <div style={{ fontSize: "10px", color: "#1e3a55", fontStyle: "italic" }}>No entities found.</div>
                    : uniqueEntities.map((e, i) => <EntityCard key={i} entity={e} />)
                  }
                </div>
              </Section>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ width: "230px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* SLA Status */}
            <Section title="SLA STATUS">
              <SlaBar incident={incident} />
            </Section>

            {/* Quick actions */}
            <Section title="QUICK ACTIONS">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <ActionBtn label="Assign to me" color="#00d4ff" onClick={() => {}} />
                <ActionBtn label="Mark Active" color="#ff9900"
                  onClick={() => setStatusLocal("Active")}
                  disabled={statusLocal === "Active" || incident.status === "Active"} />
                <ActionBtn label="Mark Resolved" color="#00ff9d"
                  onClick={() => setStatusLocal("Resolved")}
                  disabled={statusLocal === "Resolved" || incident.status === "Resolved"} />
                <ActionBtn label="Open in Defender ↗" color="#6a8aaa"
                  onClick={() => window.open(incident.webUrl, "_blank")} />
              </div>
            </Section>

            {/* Assignment */}
            <Section title="ASSIGNMENT">
              {incident.assignedTo ? (
                <div>
                  <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.1em", marginBottom: "5px" }}>ASSIGNED TO</div>
                  <div style={{ fontSize: "10px", color: "#4a7090", wordBreak: "break-all", lineHeight: 1.4 }}>
                    {incident.assignedTo}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "10px", color: "#1e3a55", fontStyle: "italic" }}>Unassigned</div>
              )}
            </Section>

            {/* MITRE ATT&CK */}
            {firstAlert?.mitreTechniques?.length > 0 && (
              <Section title="MITRE ATT&CK">
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {firstAlert.mitreTechniques.map(t => (
                    <a
                      key={t}
                      href={`https://attack.mitre.org/techniques/${t.replace(".", "/")}`}
                      target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: "7px",
                        padding: "6px 8px", background: "#040a16",
                        border: "1px solid #0d1928", borderRadius: "3px",
                        transition: "border-color 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#1e3a55"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#0d1928"}
                    >
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "#3a5a78", letterSpacing: "0.04em" }}>{t}</span>
                      <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#1e3a55" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}