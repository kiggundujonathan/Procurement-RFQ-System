import { useContext, useState } from "react";
import { RequestContext } from "../../context/RequestContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const { requests, users = [] } =
    useContext(RequestContext);

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

    const filteredRequests =
  requests.filter((req) => {
    if (!req.dateSubmitted)
      return true;

    const requestDate =
      new Date(
        req.dateSubmitted
      );

    const matchesFromDate =
      !fromDate ||
      requestDate >=
        new Date(fromDate);

    const matchesToDate =
      !toDate ||
      requestDate <=
        new Date(toDate);

    return (
      matchesFromDate &&
      matchesToDate
    );
  });
const exportExcel = () => {
  const data =
    filteredRequests.map(
      (r) => ({
        "Request ID":
          r.requestId,
        Title:
          r.requestTitle,
        Requestor:
          r.requestor,
        Department:
          r.department,
        Status: r.status,
        Amount:
          r.estimatedTotal,
        Date:
          r.dateSubmitted,
      })
    );

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "RFQ Report"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    file,
    `RFQ_Report_${fromDate}_${toDate}.xlsx`
  );
};
  // REQUEST STATS

  const approved =
    requests.filter(
      (r) => r.status === "Approved"
    ).length;

  const rejected =
    requests.filter((r) =>
      r.status?.includes("Rejected")
    ).length;

  const pending =
    requests.filter(
      (r) =>
        r.status !== "Approved" &&
        !r.status?.includes("Rejected")
    ).length;

  // USER STATS

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.status === "Active"
  ).length;

  const blockedUsers = users.filter(
    (u) => u.status === "Blocked"
  ).length;

  const administrators =
    users.filter(
      (u) =>
        u.role === "Administrator"
    ).length;

    const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    "RFQ REPORT",
    14,
    15
  );

  doc.setFontSize(10);

  doc.text(
    `From: ${
      fromDate || "All Dates"
    }`,
    14,
    25
  );

  doc.text(
    `To: ${
      toDate || "All Dates"
    }`,
    14,
    32
  );

  autoTable(doc, {
    startY: 40,

    head: [[
      "Request ID",
      "Title",
      "Department",
      "Status",
      "Amount",
    ]],

    body:
      filteredRequests.map(
        (r) => [
          r.requestId,
          r.requestTitle,
          r.department,
          r.status,
          Number(
            r.estimatedTotal || 0
          ).toLocaleString(),
        ]
      ),
  });

  doc.save(
    `RFQ_Report_${fromDate}_${toDate}.pdf`
  );
};
  return (
    <div>
      <h1
        style={{
          marginBottom: "5px",
          color: "#1F2937",
        }}
      >
        Reports & Analytics
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "25px",
        }}
      >
        View system statistics and
        generate management reports.
      </p>

      {/* REQUEST STATS */}

      <h3
        style={{
          marginBottom: "15px",
          color: "#1F2937",
        }}
      >
        Request Statistics
      </h3>

      <div style={gridStyle}>
        <StatCard
          title="Total Requests"
          value={requests.length}
        />

        <StatCard
          title="Approved"
          value={approved}
        />

        <StatCard
          title="Rejected"
          value={rejected}
        />

        <StatCard
          title="Pending"
          value={pending}
        />
      </div>

      {/* USER STATS */}

      <h3
        style={{
          margin:
            "30px 0 15px 0",
          color: "#1F2937",
        }}
      >
        User Statistics
      </h3>

      <div style={gridStyle}>
        <StatCard
          title="Total Users"
          value={totalUsers}
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
        />

        <StatCard
          title="Blocked Users"
          value={blockedUsers}
        />

        <StatCard
          title="Administrators"
          value={administrators}
        />
      </div>

      {/* ROLE SUMMARY */}

      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h3>User Roles Summary</h3>

        <div style={gridStyle}>
          <StatCard
            title="Requestors"
            value={
              users.filter(
                (u) =>
                  u.role ===
                  "Requestor"
              ).length
            }
          />

          <StatCard
            title="Finance"
            value={
              users.filter(
                (u) =>
                  u.role ===
                  "Finance"
              ).length
            }
          />

          <StatCard
            title="Supervisors"
            value={
              users.filter(
                (u) =>
                  u.role ===
                  "Supervisor"
              ).length
            }
          />

          <StatCard
            title="Procurement"
            value={
              users.filter(
                (u) =>
                  u.role ===
                  "Procurement"
              ).length
            }
          />
        </div>
      </div>

      {/* DATE FILTERS */}

      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h3>Date Filters</h3>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              style={labelStyle}
            >
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />
          </div>

          <div>
            <label
              style={labelStyle}
            >
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
              style={
                inputStyle
              }
            />
          </div>
        </div>
      </div>

      {/* DEPARTMENT SUMMARY */}

      <div
        style={{
          ...cardStyle,
          marginTop: "25px",
        }}
      >
        <h3>
          Users by Department
        </h3>

        {[
          "ICT",
          "Programs",
          "Human Resource",
          "Finance & Operations",
          "Resource Mobilization",
        ].map((dept) => (
          <div
            key={dept}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              padding:
                "12px 0",
              borderBottom:
                "1px solid #E5E7EB",
            }}
          >
            <span>{dept}</span>

            <strong>
              {
                users.filter(
                  (u) =>
                    u.department ===
                    dept
                ).length
              }
            </strong>
          </div>
        ))}
      </div>

      {/* EXPORTS */}
        <div
  style={{
    ...cardStyle,
    marginTop: "25px",
  }}
>
  <h3>
    Export Reports
  </h3>

  <p
    style={{
      color: "#64748B",
      marginBottom: "15px",
    }}
  >
    {filteredRequests.length} request(s)
    selected for export.
  </p>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <button
      style={primaryBtn}
      onClick={exportPDF}
    >
      Export PDF
    </button>

    <button
      style={primaryBtn}
      onClick={exportExcel}
    >
      Export Excel
    </button>

    <button style={primaryBtn}>
      Export CSV
    </button>
  </div>
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
        background:
          "#FFFFFF",
        borderRadius:
          "12px",
        padding: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          color: "#64748B",
          margin: 0,
          marginBottom:
            "10px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color:
            "#3DA5F4",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

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
  padding: "12px",
  border: "1px solid #D1D5DB",
  borderRadius: "10px",
  minWidth: "220px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#64748B",
  fontSize: "13px",
  fontWeight: "600",
};

const primaryBtn = {
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "10px 18px",
  cursor: "pointer",
  fontWeight: "600",
};