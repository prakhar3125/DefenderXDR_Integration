import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "var(--ion-dark)", // Changed to ION Dark Grey
      color: "var(--ion-white)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <Navbar />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </div>
  );
}