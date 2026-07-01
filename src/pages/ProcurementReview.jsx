import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";

export default function ProcurementReview() {
  const navigate = useNavigate();

  const { requests, setRequests, user } =
    useContext(RequestContext);

  const [comments, setComments] = useState({});

  if (!user || user.role !== "Procurement") {
    return (
      <div>
        <h2>Procurement Review</h2>
        <p>Access Denied</p>
      </div>
    );
  }

  const procurementRequests = requests.filter(
    (req) =>
      req.status === "Supervisor Approved" ||
      req.status === "Approved" ||
      req.status === "Procurement Rejected"
  );

const handleProcess = (index) => {
  const updated = [...requests];

  const newComment = {
    by: user.role,
    text: comments[index] || "",
    date: new Date().toLocaleString(),
  };

  // Save comment
  updated[index].comments = [
    ...(updated[index].comments || []),
    newComment,
  ];

  // Save approval history
  updated[index].approvalHistory = [
    ...(updated[index].approvalHistory || []),
    {
      role: "Procurement",
      action: "Approved",
      comment: comments[index] || "",
      date: new Date().toLocaleString(),
    },
  ];

  updated[index].status = "Approved";

  setRequests(updated);

  setComments((prev) => ({
    ...prev,
    [index]: "",
  }));
};
const handleReject = (index) => {
  const updated = [...requests];

  const newComment = {
    by: user.role,
    text: comments[index] || "",
    date: new Date().toLocaleString(),
  };

  // Save comment
  updated[index].comments = [
    ...(updated[index].comments || []),
    newComment,
  ];

  // Save approval history
  updated[index].approvalHistory = [
    ...(updated[index].approvalHistory || []),
    {
      role: "Procurement",
      action: "Rejected",
      comment: comments[index] || "",
      date: new Date().toLocaleString(),
    },
  ];

  updated[index].status = "Procurement Rejected";

  setRequests(updated);

  setComments((prev) => ({
    ...prev,
    [index]: "",
  }));
};

  return (
    <div>
      <h2>Procurement Review</h2>

      {procurementRequests.length === 0 ? (
        <p>No requests ready for procurement.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Comments</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req, index) => {
              if (
                req.status !==
                  "Supervisor Approved" &&
                req.status !== "Approved" &&
                req.status !==
                  "Procurement Rejected"
              ) {
                return null;
              }

              return (
                <tr key={index}>
                  <td>{req.requestId}</td>
                  <td>{req.requestTitle}</td>
                  <td>{req.estimatedTotal}</td>
                  <td>{req.status}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          "/request-details",
                          {
                            state: {
                              request: req,
                            },
                          }
                        )
                      }
                    >
                      View
                    </button>

                    {req.status ===
                      "Supervisor Approved" && (
                      <>
                        <button
                          onClick={() =>
                            handleProcess(index)
                          }
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(index)
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>

                  <td>
                    {req.status ===
                    "Supervisor Approved" ? (
                <textarea
                  placeholder="Add comment..."
                  value={comments[index] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [index]: e.target.value
                    })
                  }
                  rows="2"
                  style={{ width: "150px" }}
                />
                    ) : (
                      <span>
                        Comment submitted
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}