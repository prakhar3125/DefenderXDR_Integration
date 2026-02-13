# SOC Command Center - Windows Defender XDR Integration

A modern Security Operations Center (SOC) dashboard for monitoring and managing Windows Defender XDR alerts.

## 🚀 Features

### ✅ Complete Routing System
- **Login Page** - Secure authentication portal
- **SOC Dashboard** - Real-time alert monitoring
- **Analytics** - Security insights and metrics
- **Settings** - System configuration
- **Alert Details** - Deep-dive investigation pages

### 🎯 Core Functionality

#### Alert Management
- Real-time alert feed with auto-refresh
- Multi-level filtering (Severity, Status, Category)
- Advanced search across all fields
- Click-through to detailed alert views

#### Alert Categorization
- Malware Detection
- Phishing Attempts
- Intrusion Detection
- Data Exfiltration
- Suspicious Activity
- Policy Violations
- Network Anomalies

#### Status Tracking
- New → Assigned → In Progress → Resolved → Closed
- Escalation workflow
- Analyst assignment
- Activity logging

#### Metrics Dashboard
- Total alerts with trends
- Critical alert monitoring
- Response time tracking
- Resolution statistics
- Active analyst status

#### Alert Detail Pages
- Comprehensive IOC details
- Attack timeline visualization
- Investigation log/comments
- Status management
- File hash, process, network data

#### Analytics & Reporting
- 7-day alert trends
- Category breakdown
- Response metrics (MTTD, MTTR)
- Top targeted hosts
- Export capabilities

## 📁 Project Structure

```
soc-dashboard/
├── pages/
│   ├── SOCDashboard.jsx    # Main alert dashboard
│   ├── Login.jsx           # Authentication page
│   ├── Analytics.jsx       # Metrics & insights
│   ├── Settings.jsx        # Configuration
│   └── AlertDetail.jsx     # Individual alert view
├── App.jsx                 # Router configuration
├── main.jsx               # Entry point
├── index.html             # HTML template
└── package.json           # Dependencies
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 🔐 Demo Credentials
- **Username:** admin
- **Password:** admin

## 🎨 Design Features

- Dark terminal theme
- Monospace typography
- Color-coded severity levels
- Smooth animations
- Responsive layout
- Professional UI/UX

## 🔌 API Integration

Currently configured with mock data. To connect to Windows Defender XDR:

1. Update `API_BASE` constant in each page:
```javascript
const API_BASE = "https://your-api-endpoint.com";
```

2. Implement API calls in marked sections:
```javascript
// Replace mock data fetch with:
const response = await fetch(`${API_BASE}/api/alerts`);
const data = await response.json();
```

### Expected API Endpoints

```
GET    /api/alerts              # List all alerts
GET    /api/alerts/:id          # Get alert details
POST   /api/alerts/:id/status   # Update status
POST   /api/alerts/:id/assign   # Assign analyst
POST   /api/alerts/:id/comments # Add comment
GET    /api/analytics           # Get metrics
GET    /api/settings            # Get configuration
PUT    /api/settings            # Update settings
```

## 🌐 Routes

- `/` - SOC Dashboard (main view)
- `/login` - Authentication portal
- `/analytics` - Analytics & insights
- `/settings` - Configuration panel
- `/alerts/:alertId` - Individual alert details

## 🎯 Navigation

All pages include a consistent header with:
- Logo/branding
- Page navigation buttons
- User/analyst indicators
- Settings access
- Logout functionality

## 📊 Alert Severity Levels

- **CRITICAL** - Immediate action required (Red)
- **HIGH** - Priority attention needed (Orange)
- **MEDIUM** - Standard response (Yellow)
- **LOW** - Monitor and review (Blue)
- **INFO** - Informational only (Gray)

## 🔄 Alert Statuses

- **NEW** - Just detected, needs triage
- **ASSIGNED** - Analyst assigned
- **IN_PROGRESS** - Under investigation
- **RESOLVED** - Threat mitigated
- **CLOSED** - Case closed
- **ESCALATED** - Sent to senior team

## 📈 Future Enhancements

- Real-time WebSocket notifications
- Advanced filtering & saved views
- Bulk operations
- Playbook automation
- SOAR integration
- Custom dashboards
- Role-based access control
- Multi-tenant support

## 🔧 Technology Stack

- **React 18** - UI framework
- **React Router v6** - Navigation
- **Lucide React** - Icon library
- **Vite** - Build tool
- **CSS-in-JS** - Styling

## 📝 Notes

- Auto-refresh enabled by default (10s intervals)
- All data currently mocked for demo
- Fully responsive design
- Optimized for modern browsers
- No external CSS dependencies

## 🚨 Security Considerations

When integrating with production:
- Implement proper authentication
- Use HTTPS endpoints only
- Validate all API responses
- Implement rate limiting
- Add CSRF protection
- Secure sensitive IOC data
- Enable audit logging

---

**Version:** 2.0.0  
**Created:** 2026  
**License:** MIT
