import { useState } from "react";
import api from "../api/api";
// import {
//   FiEye,
//   FiEyeOff,
//   FiLock,
// } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword,
    setCurrentPassword] = useState("");

  const [newPassword,
    setNewPassword] = useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const [showCurrent,
    setShowCurrent] = useState(false);

  const [showNew,
    setShowNew] = useState(false);

  const [showConfirm,
    setShowConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert(
        "Please complete all fields."
      );
      return;
    }

   if (
  newPassword !==
  confirmPassword
) {
  alert(
    "Passwords do not match."
  );
  return;
}

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

if (
  !passwordRegex.test(
    newPassword
  )
) {
  alert(
    "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
  );

  return;
}

    try {
  await api.put(
    "/auth/change-password",
    {
      currentPassword,
      newPassword,
    }
  );

  alert(
    "Password changed successfully."
  );

  navigate("/dashboard");
} catch (error) {
  alert(
    error.response?.data?.message ||
      "Failed to change password"
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
              lineHeight: "1.8",
              opacity: 0.9,
            }}
          >
            Streamline procurement
            requests, approval workflows,
            budget oversight and reporting
            from a single platform.
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
            <FeatureItem text="Secure Access Control" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              marginBottom: "10px",
              color: "#1F2937",
            }}
          >
            Change Password
          </h2>

          <p
            style={{
              color: "#64748B",
              marginBottom: "30px",
            }}
          >
            You are using a temporary
            password. Please create a new
            password before accessing the
            system.
          </p>

          <form
            onSubmit={
              handleChangePassword
            }
          >
            {/* Current Password */}

            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              show={showCurrent}
              toggle={() =>
                setShowCurrent(
                  !showCurrent
                )
              }
            />

            {/* New Password */}

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              show={showNew}
              toggle={() =>
                setShowNew(
                  !showNew
                )
              }
            />

            {/* Confirm Password */}

            <PasswordInput
              label="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              show={showConfirm}
              toggle={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
            />
            <div
  style={{
    background: "#F8FAFC",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    color: "#64748B",
  }}
>
  <div>
    Password Requirements:
  </div>

  <div>
    • Minimum 8 characters
  </div>

  <div>
    • At least one uppercase letter
  </div>

  <div>
    • At least one lowercase letter
  </div>

  <div>
    • At least one number
  </div>

  <div>
    • At least one special character
  </div>
</div>
            <button
              type="submit"
              style={primaryBtn}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* PASSWORD FIELD */

function PasswordInput({
  label,
  value,
  onChange,
  show,
  toggle,
}) {
  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <label style={labelStyle}>
        {label}
      </label>

      <div style={inputWrapper}>
        {/* <FiLock color="#64748B" /> */}
            <span>🔒</span>
        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          style={inputStyle}
        />

        <button
          type="button"
          onClick={toggle}
          style={eyeBtn}
        >
          {show ? (
            // <FiEyeOff />
            <span>🙈</span>
          ) : (
            // <FiEye />
            <span>👁</span>
          )}
        </button>
      </div>
    </div>
  );
}

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

const cardStyle = {
  width: "100%",
  maxWidth: "500px",
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

const eyeBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#64748B",
};

const primaryBtn = {
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