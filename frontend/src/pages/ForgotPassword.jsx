import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
    
const [showMessage, setShowMessage] =
  useState(false);

  const [email, setEmail] =
    useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  if (!email.trim()) {
    alert(
      "Please enter your email address."
    );
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert(
      "Please enter a valid email address."
    );
    return;
  }

  setShowMessage(true);
};
  return (
    <div style={containerStyle}>
      {/* LEFT */}

      <div style={leftPanelStyle}>
        <div>
          <h1>
            RFQ Management System
          </h1>

          <p>
            Streamline procurement
            requests, approvals,
            reporting and user
            administration.
          </p>

          <div
            style={{
              marginTop: "40px",
            }}
          >
            <div>
              ✓ Procurement Workflow
            </div>

            <div>
              ✓ Budget Approvals
            </div>

            <div>
              ✓ Audit & Reporting
            </div>

            <div>
              ✓ User Administration
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h2>
            Forgot Password
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: "25px",
            }}
          >
            Enter your email address.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div
              style={
                inputWrapper
              }
            >
              <FiMail />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Email Address"
                style={
                  inputStyle
                }
              />
            </div>
            <div
              style={{
                background:
                  "#FEF3C7",
                padding:
                  "15px",
                borderRadius:
                  "10px",
                marginTop:
                  "20px",
                marginBottom:
                  "20px",
                color:
                  "#92400E",
              }}
            >
              Password resets are
              handled by the
              System Administrator.
              Contact the ICT team
              for assistance.
            </div>

            <button
              type="submit"
              style={
                primaryBtn
              }
            >
              Contact Administrator
            </button>
              {showMessage && (
  <div
    style={{
      background: "#DCFCE7",
      color: "#166534",
      padding: "15px",
      borderRadius: "10px",
      marginTop: "20px",
      marginBottom: "20px",
    }}
  >
    Please contact the System
    Administrator and provide the
    email address:
    <strong> {email}</strong>
  </div>
)}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/login"
                )
              }
              style={
                secondaryBtn
              }
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reuse styles from Login page */

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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F8FAFC",
};

const cardStyle = {
  width: "100%",
  maxWidth: "450px",
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "40px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.12)",
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

const primaryBtn = {
  width: "100%",
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "10px",
  padding: "14px",
  cursor: "pointer",
  marginBottom: "10px",
};

const secondaryBtn = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid #3DA5F4",
  color: "#3DA5F4",
  borderRadius: "10px",
  padding: "14px",
  cursor: "pointer",
};