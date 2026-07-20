import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

export default function Dashboard() {
const { user } =
  useContext(AuthContext);

const [requests, setRequests] =
  useState([]);

  const totalRequests =
    requests.length;

  const approved =
    requests.filter(
      (r) =>
        r.status === "Approved"
    ).length;

const pending =
  requests.filter(
    (r) =>
      r.status === "Draft" ||
      r.status ===
        "Budget Approved" ||
      r.status ===
        "Supervisor Approved"
  ).length;

  const rejected =
    requests.filter((r) =>
      r.status.includes("Rejected")
    ).length;
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const response =
        await api.get("/rfqs/my");

      setRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadDashboard();
}, []);
  return (
  <div>
    {/* Welcome Section */}
    <div
      style={{
        marginBottom: "30px",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
          color: "#1F2937",
        }}
      >
        Welcome, {user?.fullName}
      </h1>

      <p
        style={{
          color: "#6B7280",
          fontSize: "16px",
        }}
      >
        Overview of your procurement activities.
      </p>
    </div>

    {/* Statistics Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <DashboardCard
        title="Total Requests"
        value={totalRequests}
        color="#3DA5F4"
        icon={<FaFileAlt />}
      />

      <DashboardCard
        title="Approved"
        value={approved}
        color="#22C55E"
        icon={<FaCheckCircle />}
      />

      <DashboardCard
        title="Waiting Approval"
        value={pending}
        color="#F59E0B"
        icon={<FaClock />}
      />

      <DashboardCard
        title="Rejected"
        value={rejected}
        color="#EF4444"
        icon={<FaTimesCircle />}
      />
    </div>

    {/* Recent Requests */}

    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "25px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Recent Requests</h2>

     <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  }}
>
  <thead>
    <tr
      style={{
        backgroundColor: "#F3F4F6",
      }}
    >
      <th
        style={{
          textAlign: "left",
          padding: "12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        Request
      </th>

      <th
        style={{
          textAlign: "left",
          padding: "12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        Date
      </th>

      <th
        style={{
          textAlign: "left",
          padding: "12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        Status
      </th>
    </tr>
  </thead>

  <tbody>
    {[...requests]
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .slice(0, 5).map((req) => (
      <tr key={req.requestId}>
        <td
          style={{
            padding: "12px",
            borderBottom: "1px solid #eee",
          }}
        >
          {req.requestTitle}
        </td>

        <td
          style={{
            padding: "12px",
            borderBottom: "1px solid #eee",
          }}
        >
          {req.createdAt
  ? new Date(
      req.createdAt
    ).toLocaleDateString("en-GB")
  : "N/A"}
        </td>

        <td
          style={{
            padding: "12px",
            borderBottom: "1px solid #eee",
          }}
        >
          <StatusBadge
            status={req.status}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>

    {/* Approval Summary */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  }}
>
 <SummaryCard
  title="Waiting Finance"
  value={
    requests.filter(
      (r) =>
        r.currentStage ===
        "finance"
    ).length
  }
/>

<SummaryCard
  title="Waiting Supervisor"
  value={
    requests.filter(
      (r) =>
        r.currentStage ===
        "supervisor"
    ).length
  }
/>

<SummaryCard
  title="Waiting Procurement"
  value={
    requests.filter(
      (r) =>
        r.currentStage ===
        "procurement"
    ).length
  }
/>
</div>
  </div>
);
}
function DashboardCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)",
        borderLeft: `6px solid ${color}`,
        transition: "0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <h3>{title}</h3>

        <div
          style={{
            fontSize: "24px",
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <h1
        style={{
          marginTop: "20px",
          color,
        }}
      >
        {value}
      </h1>
    </div>
  );
}
function SummaryCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          color: "#3DA5F4",
        }}
      >
        {value}
      </h1>
    </div>
  );
}
function StatusBadge({ status }) {
  let background = "#FEF3C7";
  let color = "#B45309";

  if (
    status === "Approved"
  ) {
    background = "#DCFCE7";
    color = "#15803D";
  }

  if (
    status?.includes("Rejected")
  ) {
    background = "#FEE2E2";
    color = "#B91C1C";
  }

  return (
    <span
      style={{
        background,
        color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
}