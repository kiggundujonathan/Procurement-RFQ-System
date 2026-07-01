import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";

export default function SupervisorReview() {
  const navigate = useNavigate();

  const { requests, setRequests, user } =
    useContext(RequestContext);

  const [comments, setComments] = useState({});

  if (!user) {
    return (
      <div>
        <h2>Supervisor Review</h2>
        <p>Loading user...</p>
      </div>
    );
  }

  if (user.role !== "Supervisor") {
    return (
      <div>
        <h2>Supervisor Review</h2>
        <p>Access Denied</p>
      </div>
    );
  }

  const supervisorRequests = requests.filter(
    (req) =>
      req.status === "Budget Approved" ||
      req.status === "Supervisor Approved" ||
      req.status === "Supervisor Rejected"
  );

 const handleApprove = (index) => {
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
      role: "Supervisor",
      action: "Approved",
      comment: comments[index] || "",
      date: new Date().toLocaleString(),
    },
  ];

  updated[index].status = "Supervisor Approved";

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
      role: "Supervisor",
      action: "Rejected",
      comment: comments[index] || "",
      date: new Date().toLocaleString(),
    },
  ];

  updated[index].status = "Supervisor Rejected";

  setRequests(updated);

  setComments((prev) => ({
    ...prev,
    [index]: "",
  }));
};

  return (
    <div>
      <h2>Supervisor Review</h2>

      {supervisorRequests.length === 0 ? (
        <p>No requests available for approval.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Request ID</th>
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
                req.status !== "Budget Approved" &&
                req.status !== "Supervisor Approved" &&
                req.status !== "Supervisor Rejected"
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
                        navigate("/request-details", {
                          state: { request: req },
                        })
                      }
                    >
                      View
                    </button>

                    {req.status ===
                      "Budget Approved" && (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(index)
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
                    "Budget Approved" ? (
                   
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