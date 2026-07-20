import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
} from "react-icons/fi";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api"


export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

login(
  response.data.token,
  response.data.user
);

if (
  response.data.mustChangePassword
) {
  navigate("/change-password");
}
else {
  navigate("/dashboard");
}
  } 
  
  catch (error) {
    alert(
      error.response?.data?.message ||
      "Login failed"
    );
  }
};

  return (
    <div style={containerStyle}>
      {/* LEFT PANEL */}

      <div style={leftPanelStyle}>
        <div>
            
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "15px",
            }}
          >
            RFQ Management System
          </h1>

          <p
            style={{
              fontSize: "18px",
              opacity: 0.9,
              lineHeight: "1.8",
            }}
          >
            Streamline procurement
            requests, budget approvals,
            reporting and user
            administration in one
            secure platform.
          </p>

          <div
            style={{
              marginTop: "50px",
            }}
          >
            <FeatureItem text="Procurement Workflow" />
            <FeatureItem text="Budget Approvals" />
            <FeatureItem text="Audit & Reporting" />
            <FeatureItem text="User Administration" />
            <FeatureItem text="Secure Approval Process" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div style={rightPanelStyle}>
        <div style={loginCardStyle}>
          <h2
            style={{
              marginBottom: "10px",
              color: "#1F2937",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: "30px",
            }}
          >
            Sign in to continue
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label style={labelStyle}>
                Email Address
              </label>

              <div
                style={inputWrapper}
              >
                <FiMail
                  color="#64748B"
                />

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}

            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <label style={labelStyle}>
                Password
              </label>

              <div
                style={inputWrapper}
              >
                <FiLock
                  color="#64748B"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={
                    passwordToggleBtn
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  color: "#64748B",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    rememberMe
                  }
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />
                Remember Me
              </label>

            
<button
  type="button"
  style={linkButton}
  onClick={() =>
    navigate("/forgot-password")
  }
>
  Forgot Password?
</button>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              style={loginBtn}
            >
              Sign In
            </button>
          </form>

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: "13px",
            }}
          >
            RFQ Management System © 2026
          </div>
        </div>
      </div>
    </div>
  );
}

/* FEATURE ITEM */

function FeatureItem({ text }) {
  return (
    <div
      style={{
        marginBottom: "15px",
        fontSize: "16px",
      }}
    >
      ✓ {text}
    </div>
  );
}

/* STYLES */

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
};

const leftPanelStyle = {
  flex: 1,
  background:
    "linear-gradient(135deg,#3DA5F4,#2563EB)",
  color: "#FFFFFF",
  padding: "60px",
  display: "flex",
  alignItems: "center",
};

const rightPanelStyle = {
  flex: 1,
  background: "#F8FAFC",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px",
};

const loginCardStyle = {
  width: "100%",
  maxWidth: "450px",
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "40px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.12)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#374151",
  fontWeight: "600",
};

const inputWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid #D1D5DB",
  borderRadius: "10px",
  padding: "0 12px",
};

const inputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  padding: "14px 0",
};

const passwordToggleBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#64748B",
};

const loginBtn = {
  width: "100%",
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding: "14px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

const linkButton = {
  border: "none",
  background: "transparent",
  color: "#3DA5F4",
  cursor: "pointer",
  fontWeight: "600",
};