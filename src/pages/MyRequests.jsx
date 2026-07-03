
import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

export default function MyRequests() {
  const navigate = useNavigate();
  const { requests, setRequests } = useContext(RequestContext);
  const [search, setSearch] = useState("");
  const filteredRequests = requests.filter(
  (req) =>
    req.requestId
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    req.requestTitle
      .toLowerCase()
      .includes(search.toLowerCase())
);

  // Delete request
  const handleDelete = (index) => {
    const updated = requests.filter((_, i) => i !== index);
    setRequests(updated);
  };

  // Edit request
  const handleEdit = (index) => {
    navigate(`/gor?edit=${index}`);
  };

  return (
  <div>
    <h1
      style={{
        color: "#1F2937",
        marginBottom: "10px",
      }}
    >
      My Requests
    </h1>

    <p
      style={{
        color: "#64748B",
        marginBottom: "25px",
      }}
    >
      View and manage your submitted requests.
    </p>

    {/* Statistics */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "25px",
      }}
    >
      <StatCard
        title="Total Requests"
        value={requests.length}
      />

      <StatCard
        title="Draft"
        value={
          requests.filter(
            (r) => r.status === "Draft"
          ).length
        }
      />

      <StatCard
        title="Approved"
        value={
          requests.filter((r) =>
            r.status.includes("Approved")
          ).length
        }
      />

      <StatCard
        title="Rejected"
        value={
          requests.filter((r) =>
            r.status.includes("Rejected")
          ).length
        }
      />
    </div>

    {/* Search */}

    <div
      style={{
        position: "relative",
        marginBottom: "20px",
      }}
    >
      <FiSearch
        style={{
          position: "absolute",
          left: "15px",
          top: "14px",
          color: "#94A3B8",
        }}
      />

      <input
        type="text"
        placeholder="Search Request ID or Title..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 12px 12px 40px",
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
        }}
      />
    </div>

    {/* Table */}

    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#F8FAFC",
            }}
          >
            <th style={thStyle}>Request ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.map(
            (req, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {req.requestId}
                </td>

                <td style={tdStyle}>
                  {req.requestTitle}
                </td>

                <td style={tdStyle}>
                  {req.items?.[0]?.category ||
                    "N/A"}
                </td>

                <td style={tdStyle}>
                  UGX{" "}
                  {Number(
                    req.estimatedTotal
                  ).toLocaleString()}
                </td>

                <td style={tdStyle}>
                  <StatusBadge
                    status={req.status}
                  />
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      style={viewBtn}
                      onClick={() =>
                        navigate(
                          "/request-details",
                          {
                            state: {
                              requestId:
                                req.requestId,
                            },
                          }
                        )
                      }
                    >
                      <FiEye />
                    </button>

                    {(req.status ===
                      "Draft" ||
                      req.status ===
                        "Budget Rejected" ||
                      req.status ===
                        "Supervisor Rejected" ||
                      req.status ===
                        "Procurement Rejected") && (
                      <button
                        style={editBtn}
                        onClick={() =>
                          handleEdit(index)
                        }
                      >
                        <FiEdit />
                      </button>
                    )}

                    {req.status ===
                      "Draft" && (
                      <button
                        style={deleteBtn}
                        onClick={() =>
                          handleDelete(index)
                        }
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
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
function StatusBadge({ status }) {
  let background = "#FEF3C7";
  let color = "#B45309";

  if (status.includes("Approved")) {
    background = "#DCFCE7";
    color = "#15803D";
  }

  if (status.includes("Rejected")) {
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
        fontWeight: "600",
        fontSize: "13px",
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
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#64748B",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginTop: "10px",
          color: "#3DA5F4",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const thStyle = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "1px solid #E5E7EB",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #E5E7EB",
};

const viewBtn = {
  background: "#DBEAFE",
  color: "#2563EB",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
};

const editBtn = {
  background: "#FEF3C7",
  color: "#B45309",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#FEE2E2",
  color: "#DC2626",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
};