import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";

export default function FinanceReview() {
  const navigate = useNavigate();

  const { requests, setRequests, user } =
    useContext(RequestContext);

  const [comments, setComments] = useState({});

  if (!user || user.role !== "Finance") {
    return <p>Access Denied</p>;
  }

  const handleApprove = (index) => {
    const updated = [...requests];

    const newComment = {
      by: user.role,
      text: comments[index] || "",
      date: new Date().toLocaleString(),
    };

  updated[index].comments = [
  ...(updated[index].comments || []),
  newComment
];

updated[index].approvalHistory = [
  ...(updated[index].approvalHistory || []),
  {
    role: "Finance",
    action: "Approved",
    comment: comments[index] || "",
    date: new Date().toLocaleString()
  }
];

    updated[index].status = "Budget Approved";

    setRequests(updated);
    
setComments((prev) => ({
  ...prev,
  [index]: ""
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

  // Save history
  updated[index].approvalHistory = [
    ...(updated[index].approvalHistory || []),
    {
      role: "Finance",
      action: "Rejected",
      comment: comments[index] || "",
      date: new Date().toLocaleString(),
    },
  ];

  updated[index].status = "Budget Rejected";

  setRequests(updated);

  setComments((prev) => ({
    ...prev,
    [index]: "",
  }));
};

  const financeRequests = requests.filter(
    (req) =>
      req.status === "Draft" ||
      req.status === "Budget Approved" ||
      req.status === "Budget Rejected"
  );

  return (
    <div>
      <h2>Finance Review</h2>

      {financeRequests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Comments</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req, index) => {
              if (
                req.status !== "Draft" &&
                req.status !== "Budget Approved" &&
                req.status !== "Budget Rejected"
              ) {
                return null;
              }

              return (
                <tr key={index}>
                  <td>{req.requestId}</td>
                  <td>{req.requestTitle}</td>
                  <td>{req.category}</td>
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

                    {req.status === "Draft" && (
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
                    {req.status === "Draft" ? (
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
                      <span>Comment submitted</span>
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