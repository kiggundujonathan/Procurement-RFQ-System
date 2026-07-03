import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";

import {
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";

export default function ProcurementReview() {
  const navigate = useNavigate();

  const { requests, setRequests, user } =
    useContext(RequestContext);

  const [comments, setComments] = useState({});
  const [search, setSearch] = useState("");

  if (!user || user.role !== "Procurement") {
    return <p>Access Denied</p>;
  }

  const handleApprove = (index) => {
    const updated = [...requests];

    const newComment = {
      by: user.role,
      text:
        comments[
          updated[index].requestId
        ] || "",
      date: new Date().toLocaleString(),
    };

    updated[index].comments = [
      ...(updated[index].comments || []),
      newComment,
    ];

    updated[index].approvalHistory = [
      ...(updated[index].approvalHistory || []),
      {
        role: "Procurement",
        action: "Approved",
        comment:
          comments[
            updated[index].requestId
          ] || "",
        date: new Date().toLocaleString(),
      },
    ];

    updated[index].status = "Approved";

    setRequests(updated);

    setComments((prev) => ({
      ...prev,
      [updated[index].requestId]: "",
    }));
  };

  const handleReject = (index) => {
    const updated = [...requests];

    const newComment = {
      by: user.role,
      text:
        comments[
          updated[index].requestId
        ] || "",
      date: new Date().toLocaleString(),
    };

    updated[index].comments = [
      ...(updated[index].comments || []),
      newComment,
    ];

    updated[index].approvalHistory = [
      ...(updated[index].approvalHistory || []),
      {
        role: "Procurement",
        action: "Rejected",
        comment:
          comments[
            updated[index].requestId
          ] || "",
        date: new Date().toLocaleString(),
      },
    ];

    updated[index].status =
      "Procurement Rejected";

    setRequests(updated);

    setComments((prev) => ({
      ...prev,
      [updated[index].requestId]: "",
    }));
  };

  const procurementRequests =
    requests.filter(
      (req) =>
        req.status ===
          "Supervisor Approved" ||
        req.status === "Approved" ||
        req.status ===
          "Procurement Rejected"
    );

  const filteredRequests =
    procurementRequests.filter(
      (req) =>
        req.requestId
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        req.requestTitle
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div>
      <h1
        style={{
          marginBottom: "10px",
          color: "#1F2937",
        }}
      >
        Procurement Review
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "25px",
        }}
      >
        Review requests awaiting
        Procurement approval.
      </p>

      {/* Search */}

      <div
        style={{
          position: "relative",
          marginBottom: "25px",
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
            boxSizing:
              "border-box",
            padding:
              "12px 12px 12px 40px",
            borderRadius: "10px",
            border:
              "1px solid #D1D5DB",
            fontSize: "15px",
          }}
        />
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
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
              <tr
                style={{
                  background:
                    "#F8FAFC",
                  position:
                    "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <th style={thStyle}>
                  Request ID
                </th>

                <th style={thStyle}>
                  Title
                </th>

                <th style={thStyle}>
                  Category
                </th>

                <th style={thStyle}>
                  Amount
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Actions
                </th>

                <th style={thStyle}>
                  Comment
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map(
                (req, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      {req.requestId}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace:
                          "normal",
                        maxWidth:
                          "180px",
                      }}
                    >
                      {
                        req.requestTitle
                      }
                    </td>

                    <td
                      style={tdStyle}
                    >
                      {req.items?.[0]
                        ?.category ||
                        "N/A"}
                    </td>

                    <td
                      style={tdStyle}
                    >
                      {req.estimatedTotal?.toLocaleString()}
                    </td>

                    <td
                      style={tdStyle}
                    >
                      <StatusBadge
                        status={
                          req.status
                        }
                      />
                    </td>

                    <td
                      style={tdStyle}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() =>
                            navigate(
                              "/request-details",
                              {
                                state:
                                  {
                                    requestId:
                                      req.requestId,
                                  },
                              }
                            )
                          }
                          style={viewBtn}
                        >
                          <FiEye />
                        </button>

                        {req.status ===
                          "Supervisor Approved" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(
                                  requests.indexOf(
                                    req
                                  )
                                )
                              }
                              style={
                                approveBtn
                              }
                            >
                              <FiCheckCircle />
                            </button>

                            <button
                              onClick={() =>
                                handleReject(
                                  requests.indexOf(
                                    req
                                  )
                                )
                              }
                              style={
                                rejectBtn
                              }
                            >
                              <FiXCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    <td
                      style={tdStyle}
                    >
                      {req.status ===
                      "Supervisor Approved" ? (
                        <textarea
                          placeholder="Add comment..."
                          value={
                            comments[
                              req.requestId
                            ] || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setComments(
                              {
                                ...comments,
                                [req.requestId]:
                                  e
                                    .target
                                    .value,
                              }
                            )
                          }
                          style={{
                            width:
                              "100px",
                            height:
                              "30px",
                            padding:
                              "8px",
                            border:
                              "1px solid #D1D5DB",
                            borderRadius:
                              "8px",
                            resize:
                              "none",
                            fontSize:
                              "13px",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color:
                              "#64748B",
                            fontSize:
                              "14px",
                          }}
                        >
                          Submitted
                        </span>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let background = "#FEF3C7";
  let color = "#B45309";

  if (
    status.includes(
      "Approved"
    )
  ) {
    background = "#DCFCE7";
    color = "#15803D";
  }

  if (
    status.includes(
      "Rejected"
    )
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
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      {status}
    </span>
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
  whiteSpace: "nowrap",
};

const viewBtn = {
  background: "#DBEAFE",
  color: "#2563EB",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const approveBtn = {
  background: "#DCFCE7",
  color: "#15803D",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#FEE2E2",
  color: "#DC2626",
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  cursor: "pointer",
};