import { useContext, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";

export default function MyRequests() {
  const navigate = useNavigate();

  const { requests, setRequests } = useContext(RequestContext);

  const [selectedRequest, setSelectedRequest] = useState(null);

  // View request
  const handleView = (req) => {
    setSelectedRequest(req);
  };

  // Download attachment
  const handleDownload = (attachment) => {
    if (!attachment || !attachment.data) {
      alert("No file available");
      return;
    }

    const a = document.createElement("a");
    a.href = attachment.data;
    a.download = attachment.name;
    a.click();
  };

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
      <h2>My Requests</h2>

      {requests.length === 0 ? (
        <p>No requests created yet.</p>
      ) : (
        <>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req, index) => (
                <tr key={index}>
                  <td>{req.requestId}</td>
                  <td>{req.requestTitle}</td>
                  <td>{req.category}</td>
                  <td>{req.estimatedTotal}</td>
                  <td>{req.status}</td>

                  <td>
                    <button onClick={() => navigate("/request-details", {
                   state: { request: req }})}>View</button>

                    {req.status === "Draft" ||
                    req.status === "Budget Rejected" ||
                    req.status === "Supervisor Rejected" ||
                    req.status === "Procurement Rejected" ? (
                      <button onClick={() => handleEdit(index)}>
                        Edit
                      </button>
                    ) : (
                      <button disabled>Edit</button>
                    )}

                    {req.status === "Draft" ? (
                      <button onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    ) : (
                      <button disabled>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* VIEW MODAL */}

          {selectedRequest && (
            <div
              style={{
                marginTop: "20px",
                border: "1px solid #ccc",
                padding: "20px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <h3>{selectedRequest.requestTitle}</h3>

              <p>
                <strong>Request ID:</strong>{" "}
                {selectedRequest.requestId}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.status}
              </p>

              <p>
                <strong>Requestor:</strong>{" "}
                {selectedRequest.requestor}
              </p>

              <p>
                <strong>Project Code:</strong>{" "}
                {selectedRequest.projectCode}
              </p>

              <p>
                <strong>Activity Code:</strong>{" "}
                {selectedRequest.activityCode}
              </p>

              <p>
                <strong>Date Submitted:</strong>{" "}
                {selectedRequest.dateSubmitted}
              </p>

              <p>
                <strong>Estimated Total:</strong>{" "}
                {selectedRequest.estimatedTotal}
              </p>

              <h3>Items</h3>

{selectedRequest.items?.map((item, index) => {
  const lineTotal =
    (Number(item.quantity) || 0) *
    (Number(item.cost) || 0);

  return (
    <div
      key={index}
      style={{
        borderBottom: "1px solid #ddd",
        marginBottom: "10px"
      }}
    >
      <h4>Item {index + 1}</h4>

      <p>
        <strong>Name:</strong> {item.name}
      </p>

      <p>
        <strong>Description:</strong> {item.description}
      </p>

      <p>
        <strong>Quantity:</strong> {item.quantity}
      </p>

      <p>
        <strong>Unit Cost:</strong>{" "}
        {Number(item.cost).toLocaleString()}
      </p>

      <p>
        <strong>Line Total:</strong>{" "}
        {lineTotal.toLocaleString()}
      </p>
      <h4>Financial Summary</h4>

<p>
  <strong>Estimated Total:</strong>{" "}
  {Number(
    selectedRequest.estimatedTotal
  ).toLocaleString()}
</p>
    </div>
  );
})}

              <h4>Comments</h4>

              {selectedRequest.comments?.length > 0 ? (
                selectedRequest.comments.map((c, i) => (
                  <p key={i}>
                    <strong>{c.by}</strong>: {c.text}
                    <br />
                    <small>{c.date}</small>
                  </p>
                ))
              ) : (
                <p>No comments available.</p>
              )}

              <h4>Attachment</h4>

              <p>
                {selectedRequest.attachment?.name ||
                  "No attachment uploaded"}
              </p>

              {selectedRequest.attachment?.data && (
                <button
                  onClick={() =>
                    handleDownload(selectedRequest.attachment)
                  }
                >
                  Download Attachment
                </button>
              )}

              <br />
              <br />

              <button
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}