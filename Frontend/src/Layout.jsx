import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div style={{
      width: "100%",
      // Use 100dvh for mobile browsers to account for the address bar
      height: "100dvh", 
      // Hardcode color to verify it's not a variable issue
      background: "#050b17", 
      color: "#ffffff",
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