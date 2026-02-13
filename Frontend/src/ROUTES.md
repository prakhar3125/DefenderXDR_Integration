# SOC Dashboard - Route Structure

## 🌐 **Application Routes**

```
/                           → Redirects to /dashboard
/login                      → Authentication page
/dashboard                  → Main incident dashboard  
/notifications              → Notification center (dedicated page)
/analytics                  → Analytics & metrics (placeholder)
/settings                   → Configuration (placeholder)
/incidents/:incidentId      → Incident detail page with deep-link
```

## 📍 **Route Details**

### `/login`
- Authentication portal
- Demo credentials: admin / admin
- Redirects to `/dashboard` on success

### `/dashboard` (Main Page)
- Incident list view
- Real-time metrics
- Search & filtering
- Auto-refresh every 10 seconds
- Click incident → Navigate to `/incidents/:id`
- Notification badge shows unread count

### `/notifications` (New!)
- **Dedicated notification center**
- Real-time incident feed
- Audio ping + desktop notifications
- Unread counter badge
- Filter by severity (High/Medium/Low)
- Mark as read / Clear all
- Direct "Open in Defender" buttons
- Auto-refresh every 15 seconds
- Click notification → Navigate to incident detail

### `/incidents/:incidentId`
- Full incident details
- **Big blue "Open in Defender XDR" button** (deep-link)
- Entity display (Process, File, IP, User)
- Status change actions
- Analyst assignment
- Comments/notes with sync
- Back button → Returns to `/dashboard`

### `/analytics`
- Placeholder for future analytics
- Shows "Coming Soon"

### `/settings`
- Placeholder for configuration
- Shows "Coming Soon"

## 🔄 **Navigation Flow**

```
Login → Dashboard → [Incident Detail] → Back to Dashboard
                  ↓
           Notifications → [Incident Detail]
                  ↓
              Analytics
                  ↓
              Settings
```

## 🎯 **Key Features by Route**

| Route | Auto-Refresh | Notifications | Deep-Link | Assignment |
|-------|-------------|---------------|-----------|------------|
| `/dashboard` | ✅ (10s) | ✅ Badge | ❌ | ❌ |
| `/notifications` | ✅ (15s) | ✅ Audio+Desktop | ✅ | ❌ |
| `/incidents/:id` | ❌ | ❌ | ✅ | ✅ |

## 📱 **Notification Badge**

The dashboard shows a **red badge** on the Notifications button:
- Shows count of NEW incidents
- Updates in real-time
- Max display: "9+"
- Clicking opens `/notifications`

## 🔗 **Deep-Link Strategy**

Every notification and incident detail has a **Microsoft Blue button**:
```
┌─────────────────────────────────────────┐
│  🔗 Open in Microsoft Defender XDR      │
└─────────────────────────────────────────┘
```

This opens the incident in the official Defender portal where actual remediation happens.
