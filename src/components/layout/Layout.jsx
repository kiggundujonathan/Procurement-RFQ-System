import { useContext, useState } from "react";
import { RequestContext } from "../../context/RequestContext";

import {
  FaTachometerAlt,
  FaFileAlt,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaUserCheck,
  FaShoppingCart,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaUser,
  FaLock,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const navLinkStyle = ({ isActive }) => ({
  color: "white",
  textDecoration: "none",
  padding: "12px 15px",
  borderRadius: "8px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: isActive
    ? "rgba(255,255,255,0.25)"
    : "transparent",
});

const menuItemStyle = {
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
};

export default function Layout({ children }) {
  const { user } = useContext(RequestContext);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F5F7FA",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          height: "70px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 25px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#3DA5F4",
          }}
        >
          RFQ Management System
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {/* Notifications */}
          <div
            style={{
              position: "relative",
              cursor: "pointer",
            }}
          >
            <FaBell
              size={22}
              color="#666"
            />

            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#EF4444",
                color: "#FFFFFF",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                fontSize: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              3
            </span>
          </div>

          {/* Profile */}
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <FaUserCircle
                size={40}
                color="#3DA5F4"
              />

              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1F2937",
                  }}
                >
                  {user?.name || "Jonathan"}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                  }}
                >
                  {user?.role || "ICT Officer"}
                </div>
              </div>

              <FaChevronDown
                color="#666"
                style={{
                  transition: "0.3s",
                  transform:
                    showProfileMenu
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </div>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  width: "240px",
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  zIndex: 5000,
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    borderBottom:
                      "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    {user?.name || "Jonathan"}
                  </div>

                  <div
                    style={{
                      color: "#6B7280",
                      fontSize: "13px",
                    }}
                  >
                    {user?.role || "ICT Officer"}
                  </div>
                </div>

                <div style={menuItemStyle}>
                  <FaUser />
                  My Profile
                </div>

                <div style={menuItemStyle}>
                  <FaLock />
                  Change Password
                </div>

                <div style={menuItemStyle}>
                  <FaCog />
                  Settings
                </div>

                <div
                  style={{
                    borderTop:
                      "1px solid #E5E7EB",
                  }}
                >
                  <div style={menuItemStyle}>
                    <FaSignOutAlt />
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: "240px",
            backgroundColor: "#3DA5F4",
            color: "white",
            padding: "20px",
            position: "fixed",
            top: "70px",
            left: 0,
            bottom: 0,
            overflowY: "auto",
            boxShadow:
              "2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "30px",
            }}
          >
            RFQ System
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <NavLink
              to="/"
              style={navLinkStyle}
            >
              <FaTachometerAlt />
              Dashboard
            </NavLink>

            <NavLink
              to="/gor"
              style={navLinkStyle}
            >
              <FaFileAlt />
              Create Request
            </NavLink>

            <NavLink
              to="/my-requests"
              style={navLinkStyle}
            >
              <FaClipboardList />
              My Requests
            </NavLink>

            {user?.role === "Finance" && (
              <NavLink
                to="/finance"
                style={navLinkStyle}
              >
                <FaMoneyCheckAlt />
                Finance Review
              </NavLink>
            )}

            {user?.role === "Supervisor" && (
              <NavLink
                to="/supervisor"
                style={navLinkStyle}
              >
                <FaUserCheck />
                Supervisor Review
              </NavLink>
            )}

            {user?.role === "Procurement" && (
              <NavLink
                to="/procurement"
                style={navLinkStyle}
              >
                <FaShoppingCart />
                Procurement
              </NavLink>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            marginLeft: "240px",
            marginTop: "70px",
            padding: "25px",
            height: "calc(100vh - 70px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "25px",
              minHeight: "100%",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}