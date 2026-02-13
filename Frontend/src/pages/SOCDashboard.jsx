import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// CONFIG - BASED ON ACTUAL DEFENDER XDR API
// ═══════════════════════════════════════════════════════════════

const API_BASE = null; // Set to: https://graph.microsoft.com/v1.0

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
  Malware:            { color: "#ff2055", label: "Malware",             stage: "impact"  },
  Phishing:           { color: "#ff9900", label: "Phishing",            stage: "initial" },
  SuspiciousActivity: { color: "#00d4ff", label: "Suspicious Activity", stage: "active"  },
  UnwantedSoftware:   { color: "#a855f7", label: "Unwanted Software",   stage: "initial" },
  MultiStagedAttack:  { color: "#ff00dd", label: "Multi-Stage Attack",  stage: "impact"  },
  Ransomware:         { color: "#ff2055", label: "Ransomware",          stage: "impact"  },
  DataExfiltration:   { color: "#ff00dd", label: "Data Exfiltration",   stage: "impact"  },
  CredentialTheft:    { color: "#ff9900", label: "Credential Theft",    stage: "active"  },
};

const MOCK_ANALYSTS = [
  { email: "sarah.chen@company.com",     name: "Sarah Chen",      avatar: "SC", online: true  },
  { email: "mike.rodriguez@company.com", name: "Mike Rodriguez",  avatar: "MR", online: true  },
  { email: "emma.thompson@company.com",  name: "Emma Thompson",   avatar: "ET", online: false },
  { email: "james.park@company.com",     name: "James Park",      avatar: "JP", online: true  }
];

const HIGH_VALUE_DEVICES = ["SRV-DC-01", "SRV-WEB-PROD", "CFO-LAPTOP", "SRV-BACKUP"];
const DEVICES  = ["WS-FINANCE-001", "SRV-WEB-PROD", "WS-HR-042", "SRV-DC-01", "CFO-LAPTOP", "WS-DEV-12"];
const NAMES    = [
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
const SEVERITY_WEIGHT = { High: 100, Medium: 50, Low: 10, Informational: 1 };

// Deterministic seed — prevents re-render shuffle
const seed = (n) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x); };

// Generate mock incident matching ACTUAL Defender XDR API structure
const generateMockIncident = (id, forcedAgeHours) => {
  const r  = seed(id);
  const r2 = seed(id + 99);
  const r3 = seed(id + 200);
  const r4 = seed(id + 300);
  const r5 = seed(id + 400);
  const sevs  = ["High", "Medium", "Low", "Informational"];
  const stats = ["New", "Active", "Resolved"];
  const sev   = sevs[Math.floor(r  * sevs.length)];
  const stat  = stats[Math.floor(r2 * stats.length)];
  const cat   = CATEGORIES[Math.floor(r3 * CATEGORIES.length)];
  const dev   = DEVICES[Math.floor(r4 * DEVICES.length)];
  const isHV  = HIGH_VALUE_DEVICES.includes(dev);
  const ageHours = forcedAgeHours !== undefined ? forcedAgeHours : r5 * 72;
  const numericId = typeof id === "number" && id <= 1000 ? 924000 + id : id;

  return {
    // ACTUAL API fields
    incidentId:     numericId,
    incidentName:   NAMES[Math.floor(r * NAMES.length)],
    createdTime:    new Date(Date.now() - ageHours * 3600000).toISOString(),
    lastUpdateTime: new Date(Date.now() - r2 * 3600000).toISOString(),
    assignedTo:     stat !== "New" ? MOCK_ANALYSTS[Math.floor(r3 * MOCK_ANALYSTS.length)].email : null,
    classification: "TruePositive",
    determination:  cat,
    status:         stat,
    severity:       sev,
    isHighValue:    isHV,
    tags:           isHV ? ["HighValue", "Defender XDR"] : ["Defender XDR"],
    alerts: [{
      alertId:          `alert-${numericId}-001`,
      title:            "Suspicious command line activity",
      category:         cat,
      severity:         sev,
      serviceSource:    "MicrosoftDefenderForEndpoint",
      entities: [
        {
          entityType:          "Process",
          fileName:            "powershell.exe",
          processCommandLine:  "powershell.exe -enc SQBFAFgA...",
          sha256:              "a1b2c3d4e5f6..."
        },
        {
          entityType: "Ip",
          ipAddress:  `${Math.floor(r4 * 255)}.${Math.floor(r5 * 255)}.${Math.floor(r2 * 255)}.${Math.floor(r3 * 255)}`
        }
      ],
      deviceId:          dev,
      userPrincipalName: ["john.doe@company.com", "admin@company.com"][Math.floor(r4 * 2)],
      accountName:       ["john.doe", "admin", "svc.account", "m.smith"][Math.floor(r4 * 4)],
      tags:              isHV ? ["HighValue"] : []
    }],
    comments: Array.from({ length: Math.floor(r5 * 4) }, (_, i) => ({ id: i, text: "Analyst note" })),
    // CRITICAL: Deep link to Defender portal
    webUrl: `https://security.microsoft.com/incidents/${numericId}?tid=your-tenant-id`
  };
};

const BASE_INCIDENTS = Array.from({ length: 60 }, (_, i) => generateMockIncident(i + 1));

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION MANAGER
// ═══════════════════════════════════════════════════════════════

const NotificationManager = {
  async requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  },

  playSound() {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  },

  show(incident) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 New Security Incident", {
        body: `${incident.incidentName} — Severity: ${incident.severity}`,
        tag: `incident-${incident.incidentId}`,
        requireInteraction: incident.severity === "High"
      });
    }
  },

  checkNewIncidents(incidents, lastCheckTime, soundEnabled) {
    const newHigh = incidents.find(i =>
      i.severity === "High" &&
      new Date(i.createdTime) > lastCheckTime &&
      i.status === "New"
    );
    if (newHigh) {
      if (soundEnabled) this.playSound();
      this.show(newHigh);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// SMART SORT HOOK
// ═══════════════════════════════════════════════════════════════

function useSmartSort(incidents, filters) {
  return useMemo(() => {
    let result = [...incidents];
    if (filters.assetType === "critical")    result = result.filter(i => i.isHighValue);
    if (filters.attackStage === "impact")    result = result.filter(i => CATEGORY_CONFIG[i.determination]?.stage === "impact");
    if (filters.status === "pending_action") result = result.filter(i => i.status === "New" || (i.status === "Active" && !i.assignedTo));
    if (filters.severity && filters.severity !== "ALL")         result = result.filter(i => i.severity === filters.severity);
    if (filters.statusFilter && filters.statusFilter !== "ALL") result = result.filter(i => i.status === filters.statusFilter);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(i =>
        i.incidentName.toLowerCase().includes(q) ||
        i.incidentId.toString().includes(q) ||
        i.alerts[0]?.deviceId?.toLowerCase().includes(q) ||
        i.alerts[0]?.accountName?.toLowerCase().includes(q)
      );
    }
    if (filters.sortBy === "urgency") {
      result.sort((a, b) => {
        const now  = Date.now();
        const ageA = (now - new Date(a.createdTime).getTime()) / 3600000;
        const ageB = (now - new Date(b.createdTime).getTime()) / 3600000;
        return (SEVERITY_WEIGHT[b.severity] + ageB * 5) - (SEVERITY_WEIGHT[a.severity] + ageA * 5);
      });
    } else {
      result.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
    }
    return result;
  }, [incidents, filters]);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// ═══════════════════════════════════════════════════════════════
// SLA BAR
// ═══════════════════════════════════════════════════════════════

function SlaBar({ incident }) {
  const slaHours = { High: 1, Medium: 4, Low: 24, Informational: 72 };
  const hours    = slaHours[incident.severity];
  const elapsed  = (Date.now() - new Date(incident.createdTime).getTime()) / 3600000;
  const pct      = Math.min((elapsed / hours) * 100, 100);
  const color    = pct > 90 ? "#ff2055" : pct > 60 ? "#ff9900" : "#00ff9d";
  return (
    <div title={`SLA: ${Math.round(pct)}% used (${hours}h window)`}
      style={{ width: "48px", height: "3px", background: "#1a2332", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INCIDENT ROW
// ═══════════════════════════════════════════════════════════════

function IncidentRow({ incident, onClick, selected }) {
  const sev     = SEVERITY_CONFIG[incident.severity];
  const stat    = STATUS_CONFIG[incident.status];
  const cat     = CATEGORY_CONFIG[incident.determination];
  const analyst = MOCK_ANALYSTS.find(a => a.email === incident.assignedTo);
  const isNew   = incident.status === "New";

  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "3px 68px 72px 80px 1fr 120px 100px 56px 120px 44px 36px",
        alignItems: "center",
        gap: "0 10px",
        padding: "0 16px",
        height: "44px",
        cursor: "pointer",
        borderBottom: "1px solid #070d1a",
        background: selected ? "#00d4ff07" : "transparent",
        transition: "background 0.15s"
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "#ffffff03"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Severity stripe */}
      <div style={{
        width: "3px", height: "100%",
        background: sev.color, marginLeft: "-16px",
        opacity: isNew ? 1 : 0.5
      }} />

      {/* ID */}
      <span style={{ fontSize: "10px", color: "#2e4a65", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        #{incident.incidentId}
      </span>

      {/* Severity badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "2px 7px", borderRadius: "3px",
        background: sev.glow, border: `1px solid ${sev.color}40`,
        color: sev.color, fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em"
      }}>
        {sev.label}
      </div>

      {/* Status badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        padding: "2px 7px", borderRadius: "3px",
        background: `${stat.color}15`, border: `1px solid ${stat.color}35`,
        color: stat.color, fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em"
      }}>
        {isNew && (
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: stat.color, animation: "pulse 1.8s infinite", flexShrink: 0 }} />
        )}
        {stat.label}
      </div>

      {/* Incident name */}
      <span style={{ fontSize: "11px", color: "#b0cae6", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {incident.isHighValue && (
          <span style={{ color: "#ff9900", marginRight: "6px", fontSize: "8px", fontWeight: 700 }}>⬡ VIP</span>
        )}
        {incident.incidentName}
      </span>

      {/* Category */}
      <span style={{ fontSize: "10px", color: cat?.color || "#2e4a65", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
        {cat?.label || incident.determination}
      </span>

      {/* Device */}
      <span style={{ fontSize: "9px", color: "#1e3a55", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {incident.alerts[0]?.deviceId}
      </span>

      {/* SLA bar */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <SlaBar incident={incident} />
      </div>

      {/* Analyst - full name */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px", overflow: "hidden" }}>
        {analyst ? (
          <>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
              background: analyst.online ? "#00d4ff" : "#111c2e",
              color: analyst.online ? "#000" : "#2a4060",
              fontSize: "7px", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: analyst.online ? "none" : "1px solid #1a2d45",
              position: "relative"
            }}>
              {analyst.avatar}
              {analyst.online && (
                <div style={{ position: "absolute", bottom: "0px", right: "0px", width: "5px", height: "5px", borderRadius: "50%", background: "#00ff9d", border: "1px solid #050b17" }} />
              )}
            </div>
            <span style={{ fontSize: "9px", color: "#2e4a65", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {analyst.name}
            </span>
          </>
        ) : (
          <span style={{ fontSize: "9px", color: "#1a2e45", fontStyle: "italic" }}>Unassigned</span>
        )}
      </div>

      {/* Comment count */}
      <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
        {incident.comments.length > 0 && (
          <span style={{ fontSize: "9px", color: "#1e3a55", display: "flex", alignItems: "center", gap: "3px" }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {incident.comments.length}
          </span>
        )}
      </div>

      {/* Age */}
      <span style={{ fontSize: "9px", color: "#1e3a55", textAlign: "right" }}>
        {timeAgo(incident.createdTime)}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// METRICS DROPDOWN
// ═══════════════════════════════════════════════════════════════

function MetricsDropdown({ incidents }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const m = useMemo(() => ({
    total:      incidents.length,
    new_:       incidents.filter(i => i.status === "New").length,
    active:     incidents.filter(i => i.status === "Active").length,
    resolved:   incidents.filter(i => i.status === "Resolved").length,
    high:       incidents.filter(i => i.severity === "High").length,
    medium:     incidents.filter(i => i.severity === "Medium").length,
    low:        incidents.filter(i => i.severity === "Low").length,
    unassigned: incidents.filter(i => !i.assignedTo && i.status !== "Resolved").length,
    highValue:  incidents.filter(i => i.isHighValue).length,
    analysts:   MOCK_ANALYSTS.filter(a => a.online).length
  }), [incidents]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "6px 13px",
          background: open ? "#00d4ff12" : "#08101e",
          border: `1px solid ${open ? "#00d4ff45" : "#111d30"}`,
          borderRadius: "4px",
          color: open ? "#00d4ff" : "#4a6a8a",
          fontSize: "10px", fontWeight: 700, cursor: "pointer",
          letterSpacing: "0.08em", transition: "all 0.2s", fontFamily: "inherit"
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        METRICS
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: "380px", background: "#060c19",
          border: "1px solid #111d30", borderRadius: "6px",
          boxShadow: "0 24px 64px #00000090, 0 0 0 1px #00d4ff05",
          zIndex: 200, overflow: "hidden", animation: "fadeDown 0.18s ease"
        }}>
          {/* Header */}
          <div style={{ padding: "11px 16px", borderBottom: "1px solid #0a1528", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "#2e4a65", letterSpacing: "0.14em", fontWeight: 700 }}>OVERVIEW METRICS</span>
            <span style={{ fontSize: "9px", color: "#111d30" }}>LAST 72H</span>
          </div>

          {/* 2×3 stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "#0a1528" }}>
            {[
              { label: "TOTAL",      value: m.total,      color: "#00d4ff" },
              { label: "NEW",        value: m.new_,       color: "#ff2055" },
              { label: "ACTIVE",     value: m.active,     color: "#00d4ff" },
              { label: "RESOLVED",   value: m.resolved,   color: "#00ff9d" },
              { label: "HIGH SEV",   value: m.high,       color: "#ff2055" },
              { label: "UNASSIGNED", value: m.unassigned, color: "#ff9900" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#060c19", padding: "13px 15px" }}>
                <div style={{ fontSize: "8px", color: "#1e3050", letterSpacing: "0.12em", marginBottom: "5px" }}>{label}</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color, fontFamily: "inherit", lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Severity breakdown bars */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #0a1528" }}>
            <div style={{ fontSize: "8px", color: "#1e3050", letterSpacing: "0.14em", marginBottom: "10px" }}>SEVERITY BREAKDOWN</div>
            {[
              { label: "High",   value: m.high,   color: "#ff2055" },
              { label: "Medium", value: m.medium, color: "#ff9900" },
              { label: "Low",    value: m.low,    color: "#00d4ff" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "9px", color: "#2e4a65", width: "46px" }}>{label}</span>
                <div style={{ flex: 1, height: "3px", background: "#0a1528", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${m.total ? (value / m.total) * 100 : 0}%`, height: "100%", background: color, borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "10px", color, fontFamily: "inherit", width: "20px", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Analyst roster */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #0a1528", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "8px", color: "#1e3050", letterSpacing: "0.14em", marginBottom: "8px" }}>ANALYST ROSTER</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {MOCK_ANALYSTS.map(a => (
                  <div key={a.email} title={`${a.name} — ${a.online ? "Online" : "Offline"}`} style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: a.online ? "#00d4ff" : "#0e1928",
                    color: a.online ? "#000" : "#1e3050",
                    fontSize: "8px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: a.online ? "none" : "1px solid #111d30",
                    position: "relative"
                  }}>
                    {a.avatar}
                    {a.online && (
                      <div style={{ position: "absolute", bottom: "1px", right: "1px", width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d", border: "1px solid #060c19" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "26px", fontWeight: 700, color: "#00d4ff", fontFamily: "inherit", lineHeight: 1 }}>{m.analysts}</div>
              <div style={{ fontSize: "8px", color: "#1e3050" }}>of {MOCK_ANALYSTS.length} online</div>
            </div>
          </div>

          {/* High-value asset callout */}
          {m.highValue > 0 && (
            <div style={{ padding: "9px 16px", borderTop: "1px solid #0a1528", background: "#ff990008", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "9px", color: "#ff9900", letterSpacing: "0.08em" }}>⬡ HIGH-VALUE ASSET INCIDENTS</span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#ff9900", fontFamily: "inherit", marginLeft: "auto" }}>{m.highValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FILTER CHIP
// ═══════════════════════════════════════════════════════════════

function FilterChip({ label, icon, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px",
      background: active ? `${color}18` : "transparent",
      border: `1px solid ${active ? color : "#111d30"}`,
      borderRadius: "3px",
      color: active ? color : "#2e4a65",
      fontSize: "9px", fontWeight: 700, cursor: "pointer",
      letterSpacing: "0.07em", transition: "all 0.15s", fontFamily: "inherit"
    }}>
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// DETAIL PANEL  (replaces navigate — also provides navigate button)
// ═══════════════════════════════════════════════════════════════

function DetailPanel({ incident, onClose, onNavigate }) {
  const sev        = SEVERITY_CONFIG[incident.severity];
  const stat       = STATUS_CONFIG[incident.status];
  const cat        = CATEGORY_CONFIG[incident.determination];
  const analyst    = MOCK_ANALYSTS.find(a => a.email === incident.assignedTo);
  const firstAlert = incident.alerts[0];
  const ipEntity   = firstAlert?.entities?.find(e => e.entityType === "Ip");
  const procEntity = firstAlert?.entities?.find(e => e.entityType === "Process");

  return (
    <div style={{
      height: "230px", background: "#050b17",
      borderTop: "2px solid #0a1528",
      display: "flex", flexShrink: 0, overflow: "hidden",
      animation: "slideUp 0.2s ease"
    }}>
      {/* Left: Incident details */}
      <div style={{ flex: 1, padding: "14px 18px", minWidth: 0, overflowY: "auto", borderRight: "1px solid #0a1528" }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: sev.color, marginTop: "4px", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", color: "#1e3a55" }}>#{incident.incidentId}</span>
              <span style={{ padding: "1px 6px", background: sev.glow, border: `1px solid ${sev.color}40`, color: sev.color, fontSize: "8px", fontWeight: 700, borderRadius: "2px" }}>{sev.label}</span>
              <span style={{ padding: "1px 6px", background: `${stat.color}15`, border: `1px solid ${stat.color}35`, color: stat.color, fontSize: "8px", fontWeight: 700, borderRadius: "2px" }}>{stat.label}</span>
              <span style={{ fontSize: "8px", color: "#4a6a8a" }}>classification: {incident.classification}</span>
              {incident.isHighValue && <span style={{ fontSize: "8px", color: "#ff9900", fontWeight: 700 }}>⬡ VIP ASSET</span>}
            </div>
            <div style={{ fontSize: "13px", color: "#cce0ff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {incident.incidentName}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#1e3a55", cursor: "pointer", fontSize: "18px", flexShrink: 0, lineHeight: 1 }}>×</button>
        </div>

        {/* Fields grid — all ACTUAL API fields */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 16px" }}>
          {[
            ["Category",       cat?.label || incident.determination],
            ["Device",         firstAlert?.deviceId || "—"],
            ["Account",        firstAlert?.accountName || "—"],
            ["UPN",            firstAlert?.userPrincipalName || "—"],
            ["IP Address",     ipEntity?.ipAddress || "—"],
            ["Process",        procEntity?.fileName || "—"],
            ["SHA256",         procEntity?.sha256 ? procEntity.sha256.substring(0, 16) + "…" : "—"],
            ["Service Source", firstAlert?.serviceSource || "—"],
            ["Assigned To",    analyst ? analyst.name : "Unassigned"],
            ["Tags",           incident.tags?.join(", ") || "—"],
            ["Created",        new Date(incident.createdTime).toLocaleString()],
            ["Last Updated",   new Date(incident.lastUpdateTime).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k} style={{ minWidth: 0 }}>
              <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "2px" }}>{k.toUpperCase()}</div>
              <div style={{ fontSize: "9px", color: "#5a7a9a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Command line */}
        {procEntity?.processCommandLine && (
          <div style={{ marginTop: "10px", padding: "6px 10px", background: "#030810", border: "1px solid #0a1528", borderRadius: "3px" }}>
            <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "3px" }}>PROCESS COMMAND LINE</div>
            <code style={{ fontSize: "9px", color: "#4a7a9a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {procEntity.processCommandLine}
            </code>
          </div>
        )}
      </div>

      {/* Middle: Comments + Tags */}
      <div style={{ width: "200px", flexShrink: 0, padding: "14px 14px", display: "flex", flexDirection: "column", gap: "12px", borderRight: "1px solid #0a1528", overflowY: "auto" }}>
        {/* Comment count */}
        <div>
          <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "6px" }}>ANALYST COMMENTS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e4a65" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ fontSize: "11px", color: "#2e4a65" }}>
              {incident.comments.length > 0 ? `${incident.comments.length} notes` : "No notes yet"}
            </span>
          </div>
        </div>

        {/* Tags */}
        {incident.tags?.length > 0 && (
          <div>
            <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "6px" }}>TAGS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {incident.tags.map(tag => (
                <span key={tag} style={{
                  padding: "2px 7px", background: "#0a1528",
                  border: "1px solid #111d30", borderRadius: "2px",
                  fontSize: "9px", color: "#2e4a65"
                }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Analyst assigned */}
        {analyst && (
          <div>
            <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "6px" }}>ASSIGNED</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                background: analyst.online ? "#00d4ff" : "#0e1928",
                color: analyst.online ? "#000" : "#2e4a65",
                fontSize: "8px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{analyst.avatar}</div>
              <div>
                <div style={{ fontSize: "10px", color: "#4a7090" }}>{analyst.name}</div>
                <div style={{ fontSize: "8px", color: "#1a3050" }}>{analyst.online ? "● Online" : "○ Offline"}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ width: "190px", flexShrink: 0, padding: "14px 14px", display: "flex", flexDirection: "column", gap: "7px" }}>
        <div style={{ fontSize: "7px", color: "#1a3050", letterSpacing: "0.12em", marginBottom: "2px" }}>QUICK ACTIONS</div>
        {[
          { label: "View Full Incident",  color: "#00d4ff", action: () => onNavigate(incident.incidentId) },
          { label: "Assign to me",        color: "#00ff9d", action: () => {} },
          { label: "Mark Active",         color: "#ff9900", action: () => {} },
          { label: "Mark Resolved",       color: "#a855f7", action: () => {} },
          { label: "Open in Defender ↗",  color: "#6a8aaa", action: () => window.open(incident.webUrl, "_blank") },
        ].map(({ label, color, action }) => (
          <button key={label} onClick={action} style={{
            padding: "7px 10px", borderRadius: "3px",
            background: `${color}10`, border: `1px solid ${color}28`,
            color, fontSize: "9px", fontWeight: 700, cursor: "pointer",
            textAlign: "left", letterSpacing: "0.05em",
            transition: "background 0.15s", fontFamily: "inherit"
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${color}20`}
            onMouseLeave={e => e.currentTarget.style.background = `${color}10`}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

export default function SOCDashboard() {
  const navigate = useNavigate();

  const [incidents, setIncidents]         = useState(BASE_INCIDENTS);
  const [selected, setSelected]           = useState(null);
  const [autoRefresh, setAutoRefresh]     = useState(true);
  const [soundEnabled, setSoundEnabled]   = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(new Date());
  const [lastRefresh, setLastRefresh]     = useState(new Date());
  const [filters, setFilters]             = useState({
    search: "", severity: "ALL", statusFilter: "ALL",
    sortBy: "date", assetType: null, attackStage: null, status: null
  });

  const toggle = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));

  // Request notification permission on mount
  useEffect(() => {
    NotificationManager.requestPermission();
  }, []);

  // Auto-refresh — simulates polling Microsoft Graph API every 10s
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // Production:
      // const response = await fetch(`${API_BASE}/security/incidents`, { headers: { Authorization: `Bearer ${token}` } });
      // const data = await response.json();
      // setIncidents(data.value);

      if (Math.random() > 0.65) {
        const randId     = Math.floor(Math.random() * 90000) + 10000;
        const newIncident = generateMockIncident(randId, 0.05);
        setIncidents(prev => [newIncident, ...prev.slice(0, 99)]);
        NotificationManager.checkNewIncidents([newIncident], lastCheckTime, soundEnabled);
        setLastCheckTime(new Date());
        setLastRefresh(new Date());
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, lastCheckTime, soundEnabled]);

  const sortedIncidents  = useSmartSort(incidents, filters);
  const selectedIncident = selected ? incidents.find(i => i.incidentId === selected) : null;

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#050b17",
      color: "#c0d4ec",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#111d30; border-radius:3px; }
        input, select, button { font-family:inherit; }
        input::placeholder { color:#111d30; }
        select option { background:#060c19; }
      `}</style>

      {/* ══ TOP NAV ══ */}
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

        {/* Live pulse */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d", animation: "pulse 2.2s infinite" }} />
          <span style={{ fontSize: "8px", color: "#164030", letterSpacing: "0.12em", fontWeight: 700 }}>LIVE</span>
        </div>

        <span style={{ fontSize: "8px", color: "#111d30" }}>
          refreshed {timeAgo(lastRefresh.toISOString())} ago
        </span>

        <div style={{ flex: 1 }} />

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(v => !v)}
          title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
          style={{
            width: "28px", height: "28px", borderRadius: "3px",
            background: soundEnabled ? "#00ff9d10" : "transparent",
            border: `1px solid ${soundEnabled ? "#00ff9d35" : "#111d30"}`,
            color: soundEnabled ? "#00ff9d" : "#1e3050",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {soundEnabled
              ? <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>
              : <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>
            }
          </svg>
        </button>

        {/* Auto-refresh toggle */}
        <button
          onClick={() => setAutoRefresh(v => !v)}
          title={autoRefresh ? "Pause auto-refresh" : "Resume auto-refresh"}
          style={{
            width: "28px", height: "28px", borderRadius: "3px",
            background: autoRefresh ? "#00d4ff10" : "transparent",
            border: `1px solid ${autoRefresh ? "#00d4ff35" : "#111d30"}`,
            color: autoRefresh ? "#00d4ff" : "#1e3050",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ animation: autoRefresh ? "spin 3s linear infinite" : "none" }}>
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button style={{
            width: "28px", height: "28px", borderRadius: "3px",
            background: "transparent", border: "1px solid #111d30",
            color: "#1e3050", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div style={{ position: "absolute", top: "4px", right: "4px", width: "5px", height: "5px", borderRadius: "50%", background: "#ff2055", animation: "pulse 2s infinite" }} />
        </div>

        {/* Metrics dropdown */}
        <MetricsDropdown incidents={incidents} />
      </header>

      {/* ══ FILTER BAR ══ */}
      <div style={{
        padding: "0 18px", height: "42px",
        display: "flex", alignItems: "center", gap: "9px",
        background: "#040a16", borderBottom: "1px solid #07101c",
        flexShrink: 0
      }}>
        {/* Search */}
        <div style={{ position: "relative", width: "220px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#111d30" strokeWidth="2.5"
            style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search ID, name, device, account..."
            style={{
              width: "100%", padding: "5px 8px 5px 28px",
              background: "#070e1c", border: "1px solid #0e1a2c",
              borderRadius: "3px", color: "#6a8aaa", fontSize: "9px", outline: "none"
            }}
          />
        </div>

        <div style={{ width: "1px", height: "18px", background: "#090f1e" }} />

        {/* Severity filter */}
        <select
          value={filters.severity}
          onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}
          style={{ padding: "4px 8px", background: "#070e1c", border: "1px solid #0e1a2c", borderRadius: "3px", color: "#4a6a8a", fontSize: "9px", outline: "none", cursor: "pointer" }}
        >
          <option value="ALL">All Severity</option>
          {Object.keys(SEVERITY_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={filters.statusFilter}
          onChange={e => setFilters(f => ({ ...f, statusFilter: e.target.value }))}
          style={{ padding: "4px 8px", background: "#070e1c", border: "1px solid #0e1a2c", borderRadius: "3px", color: "#4a6a8a", fontSize: "9px", outline: "none", cursor: "pointer" }}
        >
          <option value="ALL">All Status</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={{ width: "1px", height: "18px", background: "#090f1e" }} />

        {/* Smart filter chips */}
        <FilterChip label="SLA AT RISK"   icon="🔥" active={filters.sortBy === "urgency"}          color="#ff2055"
          onClick={() => setFilters(f => ({ ...f, sortBy: f.sortBy === "urgency" ? "date" : "urgency" }))} />
        <FilterChip label="VIP ASSETS"    icon="⬡"  active={filters.assetType === "critical"}       color="#ff9900"
          onClick={() => toggle("assetType", "critical")} />
        <FilterChip label="ACTIVE BREACH" icon="⚡" active={filters.attackStage === "impact"}       color="#ff00cc"
          onClick={() => toggle("attackStage", "impact")} />
        <FilterChip label="NEEDS ACTION"  icon="◉"  active={filters.status === "pending_action"}    color="#00d4ff"
          onClick={() => toggle("status", "pending_action")} />

        <div style={{ flex: 1 }} />

        {/* Result count */}
        <span style={{ fontSize: "9px" }}>
          <span style={{ color: "#2e5a80" }}>{sortedIncidents.length}</span>
          <span style={{ color: "#0e1a2c" }}> / {incidents.length}</span>
        </span>
      </div>

      {/* ══ TABLE HEADER ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "3px 68px 72px 80px 1fr 120px 100px 56px 120px 44px 36px",
        alignItems: "center", gap: "0 10px",
        padding: "0 16px", height: "28px",
        background: "#030810", borderBottom: "1px solid #070d18",
        flexShrink: 0
      }}>
        {["", "ID", "SEV", "STATUS", "INCIDENT NAME", "CATEGORY", "DEVICE", "SLA", "ANALYST", "CMT", "AGE"].map((h, i) => (
          <span key={i} style={{ fontSize: "7px", fontWeight: 700, color: "#1a3050", letterSpacing: "0.14em" }}>{h}</span>
        ))}
      </div>

      {/* ══ INCIDENT LIST — takes all remaining space ══ */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {sortedIncidents.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111d30" strokeWidth="1">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontSize: "10px", color: "#1a3050" }}>No incidents match your filters</span>
          </div>
        ) : (
          sortedIncidents.map(incident => (
            <IncidentRow
              key={incident.incidentId}
              incident={incident}
              selected={selected === incident.incidentId}
              onClick={() => setSelected(s => s === incident.incidentId ? null : incident.incidentId)}
            />
          ))
        )}
      </div>

      {/* ══ DETAIL PANEL — slides up on row click ══ */}
      {selectedIncident && (
        <DetailPanel
          incident={selectedIncident}
          onClose={() => setSelected(null)}
          onNavigate={(id) => navigate(`/incidents/${id}`)}
        />
      )}
    </div>
  );
}