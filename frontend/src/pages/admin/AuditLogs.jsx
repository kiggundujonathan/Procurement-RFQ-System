import { useState } from "react";

export default function AuditLogs() {
  const [search, setSearch] =
    useState("");

  const auditLogs = [
    {
      date: "2026-07-06",
      user: "Jonathan",
      action: "Created Request",
      details: "GOR-2026-1001",
    },

    {
      date: "2026-07-06",
      user: "Finance Officer",
      action: "Approved Request",
      details: "GOR-2026-1001",
    },

    {
      date: "2026-07-05",
      user: "Administrator",
      action: "Reset Password",
      details: "John Doe",
    },
  ];

  const filteredLogs =
    auditLogs.filter(
      (log) =>
        log.user
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        log.action
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
    const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  padding: "25px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #D1D5DB",
  borderRadius: "10px",
  boxSizing: "border-box",
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  background: "#F8FAFC",
  borderBottom:
    "1px solid #E5E7EB",
};

const tdStyle = {
  padding: "15px",
  borderBottom:
    "1px solid #E5E7EB",
};

  return (
    <div>
      <h1
        style={{
          marginBottom: "5px",
          color: "#1F2937",
        }}
      >
        Audit Logs
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "25px",
        }}
      >
        View all system activity and
        transaction history.
      </p>

      {/* SUMMARY */}

      <div style={gridStyle}>
        <StatCard
          title="Total Logs"
          value={auditLogs.length}
        />

        <StatCard
          title="User Actions"
          value={
            auditLogs.filter(
              (l) =>
                l.action.includes(
                  "User"
                )
            ).length
          }
        />

        <StatCard
          title="Request Actions"
          value={
            auditLogs.filter(
              (l) =>
                l.action.includes(
                  "Request"
                )
            ).length
          }
        />

        <StatCard
          title="Today"
          value={
            auditLogs.filter(
              (l) =>
                l.date ===
                "2026-07-06"
            ).length
          }
        />
      </div>

      {/* SEARCH */}

      <div
        style={{
          margin: "25px 0",
        }}
      >
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>

      {/* TABLE */}

      <div
        style={{
          ...cardStyle,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>
                Date
              </th>

              <th style={thStyle}>
                User
              </th>

              <th style={thStyle}>
                Action
              </th>

              <th style={thStyle}>
                Details
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map(
              (
                log,
                index
              ) => (
                <tr key={index}>
                  <td
                    style={
                      tdStyle
                    }
                  >
                    {log.date}
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {log.user}
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {log.action}
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {log.details}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function StatCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          color: "#64748B",
          margin: 0,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: "#3DA5F4",
          marginTop: "10px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}