import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
  Clock, Users, AlertTriangle, CheckCircle, Home, Settings, LogOut,
  Calendar, Filter, Download, ArrowUpRight, ArrowDownRight
} from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data for charts
  const alertTrends = [
    { date: "Mon", critical: 12, high: 28, medium: 45, low: 32 },
    { date: "Tue", critical: 15, high: 32, medium: 38, low: 28 },
    { date: "Wed", critical: 8, high: 25, medium: 52, low: 35 },
    { date: "Thu", critical: 18, high: 38, medium: 42, low: 30 },
    { date: "Fri", critical: 22, high: 42, medium: 48, low: 25 },
    { date: "Sat", critical: 5, high: 15, medium: 25, low: 18 },
    { date: "Sun", critical: 6, high: 18, medium: 28, low: 20 }
  ];

  const categoryBreakdown = [
    { name: "Malware", count: 142, color: "#ff0844", percentage: 32 },
    { name: "Phishing", count: 98, color: "#ff6b00", percentage: 22 },
    { name: "Intrusion", count: 76, color: "#ff00ff", percentage: 17 },
    { name: "Data Exfil", count: 54, color: "#ffaa00", percentage: 12 },
    { name: "Suspicious", count: 48, color: "#00d9ff", percentage: 11 },
    { name: "Policy", count: 27, color: "#7a8599", percentage: 6 }
  ];

  const topTargets = [
    { host: "WS-FINANCE-001", alerts: 45, severity: "CRITICAL" },
    { host: "SRV-WEB-PROD", alerts: 38, severity: "HIGH" },
    { host: "WS-HR-042", alerts: 32, severity: "HIGH" },
    { host: "SRV-DB-PRIMARY", alerts: 28, severity: "CRITICAL" },
    { host: "WS-DEV-015", alerts: 24, severity: "MEDIUM" }
  ];

  const responseMetrics = [
    { metric: "Mean Time to Detect (MTTD)", value: "4.2 min", trend: -12, status: "good" },
    { metric: "Mean Time to Respond (MTTR)", value: "12.5 min", trend: -8, status: "good" },
    { metric: "Mean Time to Resolve (MTTR)", value: "2.3 hrs", trend: 5, status: "bad" },
    { metric: "Alert Resolution Rate", value: "87%", trend: 3, status: "good" },
    { metric: "False Positive Rate", value: "8.2%", trend: -15, status: "good" },
    { metric: "Escalation Rate", value: "15%", trend: 2, status: "neutral" }
  ];

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


      {/* Controls */}
      <div style={{
        padding: "12px 20px",
        background: "#0a0e1a",
        borderBottom: "1px solid #1a2332",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Calendar size={14} style={{ color: "#7a8599" }} />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: "8px 12px",
              background: "#050810",
              border: "1px solid #1a2332",
              borderRadius: "4px",
              color: "#e0e6f0",
              fontSize: "11px"
            }}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <button
          style={{
            padding: "8px 16px",
            background: "#00d9ff",
            border: "none",
            borderRadius: "4px",
            color: "#000",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Download size={12} />
          Export Report
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "16px",
        alignContent: "start"
      }}>
        {/* Alert Trends Chart */}
        <div style={{
          gridColumn: "span 8",
          background: "#0a0e1a",
          border: "1px solid #1a2332",
          borderRadius: "6px",
          padding: "16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={16} style={{ color: "#00d9ff" }} />
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e0e6f0" }}>
                Alert Trends (7 Days)
              </h3>
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "10px" }}>
              {[
                { label: "Critical", color: "#ff0844" },
                { label: "High", color: "#ff6b00" },
                { label: "Medium", color: "#ffaa00" },
                { label: "Low", color: "#00d9ff" }
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: item.color }} />
                  <span style={{ color: "#7a8599" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
            {alertTrends.map((day, i) => {
              const total = day.critical + day.high + day.medium + day.low;
              const maxTotal = Math.max(...alertTrends.map(d => d.critical + d.high + d.medium + d.low));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ 
                    width: "100%", 
                    display: "flex", 
                    flexDirection: "column-reverse",
                    height: `${(total / maxTotal) * 180}px`,
                    background: "linear-gradient(to top, #ff0844, #ff6b00 30%, #ffaa00 60%, #00d9ff)",
                    borderRadius: "4px 4px 0 0",
                    position: "relative"
                  }}>
                    <div style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#e0e6f0"
                    }}>
                      {total}
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", color: "#7a8599", fontWeight: 600 }}>
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{
          gridColumn: "span 4",
          background: "#0a0e1a",
          border: "1px solid #1a2332",
          borderRadius: "6px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <PieChart size={16} style={{ color: "#00d9ff" }} />
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e0e6f0" }}>
              Category Breakdown
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {categoryBreakdown.map((cat, i) => (
              <div key={i} style={{
                background: "#050810",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                padding: "10px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#e0e6f0", fontWeight: 600 }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: "11px", color: "#7a8599" }}>
                    {cat.count}
                  </span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "6px", 
                  background: "#1a2332", 
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${cat.percentage}%`,
                    height: "100%",
                    background: cat.color,
                    borderRadius: "3px"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Metrics */}
        <div style={{
          gridColumn: "span 8",
          background: "#0a0e1a",
          border: "1px solid #1a2332",
          borderRadius: "6px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Activity size={16} style={{ color: "#00d9ff" }} />
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e0e6f0" }}>
              Response Metrics
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {responseMetrics.map((metric, i) => (
              <div key={i} style={{
                background: "#050810",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                padding: "12px"
              }}>
                <div style={{ fontSize: "10px", color: "#7a8599", marginBottom: "6px", textTransform: "uppercase" }}>
                  {metric.metric}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#00d9ff" }}>
                    {metric.value}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    color: metric.status === "good" ? "#00ff88" : metric.status === "bad" ? "#ff0844" : "#ffaa00",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px"
                  }}>
                    {metric.trend > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
                <div style={{ fontSize: "9px", color: "#7a8599" }}>
                  vs previous period
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Targets */}
        <div style={{
          gridColumn: "span 4",
          background: "#0a0e1a",
          border: "1px solid #1a2332",
          borderRadius: "6px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <AlertTriangle size={16} style={{ color: "#ff0844" }} />
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e0e6f0" }}>
              Top Targeted Hosts
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topTargets.map((target, i) => (
              <div key={i} style={{
                background: "#050810",
                border: "1px solid #1a2332",
                borderRadius: "4px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#e0e6f0", fontWeight: 600, marginBottom: "2px" }}>
                    {target.host}
                  </div>
                  <div style={{ fontSize: "9px", color: "#7a8599" }}>
                    {target.alerts} alerts
                  </div>
                </div>
                <span style={{
                  padding: "3px 8px",
                  background: target.severity === "CRITICAL" ? "rgba(255, 8, 68, 0.2)" : "rgba(255, 107, 0, 0.2)",
                  color: target.severity === "CRITICAL" ? "#ff0844" : "#ff6b00",
                  borderRadius: "3px",
                  fontSize: "9px",
                  fontWeight: 600
                }}>
                  {target.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
