import {
  useState,
  useEffect,
} from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye
} from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RequestManagement() {
  const navigate = useNavigate();
 const [requests, setRequests] = useState([]);

const [search, setSearch] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState("All");

  const approvedRequests =
  requests.filter(
    (r) => r.status === "Approved"
  ).length;

const rejectedRequests =
  requests.filter((r) =>
    r.status.includes("Rejected")
  ).length;

const pendingRequests =
  requests.filter(
    (r) =>
      !r.status.includes("Rejected") &&
      r.status !== "Approved"
  ).length;
  const [fromDate, setFromDate] =
  useState("");

const [toDate, setToDate] =
  useState("");
const filteredRequests =
  requests.filter((req) => {
    const matchesSearch =
      req.requestId
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      req.requestTitle
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesStatus =
      statusFilter === "All"
        ? true
        : req.status ===
          statusFilter;

    const requestDate = new Date(
      req.createdAt
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
      matchesSearch &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate
    );
  });
const exportCSV = () => {
  const headers = [
    "Request ID",
    "Title",
    "Requestor",
    "Department",
    "Status",
    "Amount",
  ];

  const rows = filteredRequests.map(
    (r) => [
      r.requestId,
      r.requestTitle,
      r.requestedBy?.fullName,
      r.department,
      r.status,
      r.estimatedTotal,
    ]
  );

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row.join(",")
    )
    .join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv",
    }
  );

  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "RFQ_Requests.csv";

  link.click();
};
const exportExcel = () => {
  const excelData =
    filteredRequests.map(
      (r) => ({
        "Request ID":
          r.requestId,
        Title:
          r.requestTitle,
        Requestor:
          r.requestedBy?.fullName,
        Department:
          r.department,
        Status: r.status,
        Amount:
          r.estimatedTotal,
      })
    );

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Requests"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    blob,
    "RFQ_Requests.xlsx"
  );
};
const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);

  doc.text(
    "RFQ Requests Report",
    14,
    15
  );

  const rows =
    filteredRequests.map(
      (r) => [
        r.requestId,
        r.requestTitle,
        r.requestedBy?.fullName,
        r.department,
        r.status,
        r.estimatedTotal,
      ]
    );

  autoTable(doc, {
    head: [[
      "ID",
      "Title",
      "Requestor",
      "Department",
      "Status",
      "Amount",
    ]],
    body: rows,
    startY: 25,
  });

  doc.save(
    "RFQ_Requests.pdf"
  );
};
useEffect(() => {
  const loadRequests = async () => {
    try {
      const response =
        await api.get(
          "/rfqs/admin/all"
        );

      setRequests(
        response.data
      );

      console.log(
        "ADMIN REQUESTS:",
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadRequests();
}, []);

return (
  <div>
    {/* Header */}

    <h1>Request Management</h1>

    <p>
      Manage all requests in the system.
    </p>

    {/* Statistics Cards */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "25px",
      }}
    >
      <StatCard
        title="Total Requests"
        value={requests.length}
      />

      <StatCard
        title="Pending"
        value={pendingRequests}
      />

      <StatCard
        title="Approved"
        value={approvedRequests}
      />

      <StatCard
        title="Rejected"
        value={rejectedRequests}
      />
    </div>
      <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
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

  <button
    style={primaryBtn}
    onClick={exportCSV}
  >
    Export CSV
  </button>
</div>
      
    {/* Search & Filters */}

   <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  }}
>
  <input
    type="text"
    placeholder="Search Request ID or Title..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
      flex: "1",
      minWidth: "250px",
      padding: "12px",
      border:
        "1px solid #D1D5DB",
      borderRadius: "10px",
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(
        e.target.value
      )
    }
    style={{
      padding: "12px",
      border:
        "1px solid #D1D5DB",
      borderRadius: "10px",
      minWidth: "180px",
    }}
  >
    <option value="All">
      All Statuses
    </option>

    <option value="Draft">
      Draft
    </option>

    <option value="Budget Approved">
      Budget Approved
    </option>

    <option value="Budget Rejected">
      Budget Rejected
    </option>

    <option value="Supervisor Approved">
      Supervisor Approved
    </option>

    <option value="Supervisor Rejected">
      Supervisor Rejected
    </option>

    <option value="Approved">
      Approved
    </option>

    <option value="Procurement Rejected">
      Procurement Rejected
    </option>
  </select>

<div
  style={{
    display: "flex",
    gap: "15px",
    alignItems: "end",
  }}
>
  <div>
    <label
      style={{
        display: "block",
        marginBottom: "5px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748B",
      }}
    >
      From Date
    </label>

    <input
      type="date"
      value={fromDate}
      onChange={(e) =>
        setFromDate(e.target.value)
      }
      style={dateInputStyle}
    />
  </div>

  <div>
    <label
      style={{
        display: "block",
        marginBottom: "5px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748B",
      }}
    >
      To Date
    </label>

    <input
      type="date"
      value={toDate}
      onChange={(e) =>
        setToDate(e.target.value)
      }
      style={dateInputStyle}
    />
  </div>
</div>
</div>

      {/* Requests Table */}
              <div
                style={{
                  ...cardStyle,
                  overflowX: "auto",
                }}
              >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Requestor</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {filteredRequests.map((req) => (
            <tr key={req.requestId}>
              <td style={tdStyle}>
                {req.requestId}
              </td>
              <td style={tdStyle}>
                {req.requestTitle}
              </td>
              <td style={tdStyle}>
                {req.requestor}
              </td>
              <td style={tdStyle}>
                {req.department}
              </td>
             
              <td style={tdStyle}>
                UGX{" "}
                {Number(
                  req.estimatedTotal || 0
                ).toLocaleString()}
              </td>

              <td style={tdStyle}>
                <StatusBadge
                 status={req.status} />
              </td>
  
                            <td
                style={{
                  ...tdStyle,
                  textAlign: "center",
                }}
              >
                <button
                  style={viewBtn}
                  onClick={() =>
                    navigate(
                          "/request-details",
                          {
                            state: {
                              rfqId: req._id,
                            },
                          }
                        )
                  }
                >
                  <FiEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
function StatusBadge({ status }) {
  let background = "#FEF3C7";
  let color = "#B45309";

  if (status?.includes("Approved")) {
    background = "#DCFCE7";
    color = "#15803D";
  }

  if (status?.includes("Rejected")) {
    background = "#FEE2E2";
    color = "#DC2626";
  }

  return (
    <span
      style={{
        background,
        color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value }) {
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
const cardStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  padding: "25px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};
const primaryBtn = {
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "600",
};

const viewBtn = {
  background: "#DBEAFE",
  color: "#2563EB",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
  marginRight: "5px",
};

const downloadBtn = {
  background: "#EDE9FE",
  color: "#7C3AED",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};
const thStyle = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "1px solid #E5E7EB",
  background: "#F8FAFC",
  color: "#1F2937",
  fontWeight: "600",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #E5E7EB",
  color: "#374151",
};
const dateInputStyle = {
  padding: "12px 15px",
  border: "1px solid #D1D5DB",
  borderRadius: "10px",
  background: "#FFFFFF",
  color: "#374151",
  fontSize: "14px",
  minWidth: "180px",
  outline: "none",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};