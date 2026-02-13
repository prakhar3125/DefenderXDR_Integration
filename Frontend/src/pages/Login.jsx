import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        navigate("/");
      } else {
        setError("Invalid credentials. Try: admin / admin");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#050810",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace"
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #00d9ff; color: #000; }
      `}</style>

      <div style={{
        background: "#0a0e1a",
        border: "1px solid #1a2332",
        borderRadius: "8px",
        padding: "40px",
        width: "420px",
        maxWidth: "90%",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "32px"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ff0844, #00d9ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <Shield size={40} style={{ color: "#fff" }} />
          </div>
          <h1 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e0e6f0",
            letterSpacing: "0.05em",
            marginBottom: "4px"
          }}>
            SOC COMMAND CENTER
          </h1>
          <p style={{
            fontSize: "11px",
            color: "#7a8599",
            textTransform: "uppercase"
          }}>
            Secure Access Portal
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 8, 68, 0.1)",
            border: "1px solid #ff0844",
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={16} style={{ color: "#ff0844" }} />
            <span style={{ fontSize: "11px", color: "#ff0844" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "10px",
              color: "#7a8599",
              marginBottom: "8px",
              fontWeight: 600
            }}>
              USERNAME
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7a8599"
              }} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  color: "#e0e6f0",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "10px",
              color: "#7a8599",
              marginBottom: "8px",
              fontWeight: 600
            }}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7a8599"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 40px",
                  background: "#050810",
                  border: "1px solid #1a2332",
                  borderRadius: "4px",
                  color: "#e0e6f0",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#7a8599",
                  display: "flex"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#7a8599" : "linear-gradient(135deg, #ff0844, #00d9ff)",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "monospace"
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid #1a2332",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "10px", color: "#7a8599", marginBottom: "8px" }}>
            Demo Credentials
          </p>
          <p style={{ fontSize: "11px", color: "#00d9ff", fontFamily: "monospace" }}>
            username: <strong>admin</strong> | password: <strong>admin</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
