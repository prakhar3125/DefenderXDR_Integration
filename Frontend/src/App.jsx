// App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import SOCDashboard from "./pages/SOCDashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import IncidentDetail from "./pages/IncidentDetail";
import NotificationBar from "./pages/NotificationBar";

// Import the new Layout
import Layout from "./Layout"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES (No Navbar) */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES (With Navbar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SOCDashboard />} />
          <Route path="/notifications" element={<NotificationBar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/incidents/:incidentId" element={<IncidentDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}