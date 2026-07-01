import { useState, useEffect } from "react";
import { useContext } from "react";
import { RequestContext } from "../../context/RequestContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function GORPage() {
const navigate = useNavigate();
const { requests, setRequests } = useContext(RequestContext);
const location = useLocation();

// Get index from URL
const query = new URLSearchParams(location.search);
const editIndex = query.get("edit") !== null ? Number(query.get("edit")) : null;
const isEditing = editIndex !== null;

  // Simulated logged-in user
  const loggedInUser = {
    name: "Jonathan Kiggundu",
    department: "ICT",
  };

  // Categories (later from database)
  const categories = [
    "IT Equipment",
    "Office Supplies",
    "Furniture",
    "Consulting Services",
    "Maintenance"
  ];

  // Generate Request ID
  const generateRequestId = () => {
    const random = Math.floor(Math.random() * 10000);
    return `GOR-${new Date().getFullYear()}-${random}`;
  };

  const [form, setForm] = useState({
    requestId: "",
    requestTitle: "",
    requestor: loggedInUser.name,
    department: loggedInUser.department,
    // category: "",
    dateSubmitted: "",
   // budgetCode: "",
    status: "Draft",
    items: [
      { description: "", quantity: "", cost: "" }
    ],
    attachment: null,
    Comments: []
  });

  // Initialize auto fields
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      requestId: generateRequestId(),
      dateSubmitted: new Date().toLocaleDateString(),
    }));
  }, []);

useEffect(() => {
  if (editIndex !== null && requests[editIndex]) {
    setForm(requests[editIndex]);
  }
}, [editIndex, requests]);


  // Handle normal input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle item input
  const handleItemChange = (index, e) => {
    const newItems = [...form.items];
    newItems[index][e.target.name] = e.target.value;

    setForm({
      ...form,
      items: newItems
    });
  };
  
  // Add item
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: "", cost: "" }]
    });
  };

  // Remove item
  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);

    setForm({
      ...form,
      items: newItems
    });
  };
  
const calculateItemTotal = (item) => {
  return (
    (Number(item.quantity) || 0) *
    (Number(item.cost) || 0)
  );
};


  // Calculate total
  const calculateTotal = () => {
    return form.items.reduce((total, item) => {
      return total + ((Number(item.quantity) || 0) * (Number(item.cost) || 0));
    }, 0);
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setForm({
      ...form,
      attachment: {
        name: file.name,
        data: reader.result // ✅ base64 string
      }
    });
  };

  reader.readAsDataURL(file);
};
const handleSubmit = (e) => {
  e.preventDefault();

  const submittedForm = {
    ...form,
    estimatedTotal: calculateTotal(),

    // ALWAYS RESET STATUS WHEN EDITING
    status: "Draft",
    comments: [],
    approvalHistory: []
  };

  if (editIndex !== null) {
    // UPDATE existing
    const updatedRequests = [...requests];
    updatedRequests[editIndex] = submittedForm;
    setRequests(updatedRequests);

    alert("Request updated and resubmitted!");
    navigate("/my-requests");

  } else {
    // ✅ CREATE new
    setRequests((prev) => [...prev, submittedForm]);

    alert("Request created!");
  }

  // reset form
  setForm({
    requestId: generateRequestId(),
    requestTitle: "",
    requestor: loggedInUser.name,
    department: loggedInUser.department,
    // category: "",
    dateSubmitted: new Date().toLocaleDateString(),
    projectCode: "",
    activityCode: "",
    paymentCode: "",
    status: "Draft",
    items: [{ name: "", description: "", quantity: "", cost: "" }],
    attachment: null,
    comments: []
  });
};
  return (
    <div className="page-container">

<h2>
  {isEditing ? "Edit Request" : "Goods Order Request"}
</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {/* Request ID */}
        <div>
          <label>Request ID:</label><br />
          <input value={form.requestId} disabled />
        </div>

        {/* Request Title */}
        <div>
          <label>Request Title:</label><br />
          <input
            type="text"
            name="requestTitle"
            value={form.requestTitle}
            onChange={handleChange}
            required
          />
        </div>

        {/* Requestor */}
        <div>
          <label>Requestor:</label><br />
          <input value={form.requestor} disabled />
        </div>

        {/* Department */}
        <div>
          <label>Department:</label><br />
          <input value={form.department} disabled />
        </div>
        {/* Date Submitted */}
        <div>
          <label>Date Submitted:</label><br />
          <input value={form.dateSubmitted} disabled />
        </div>
<div className="full-width">
        <h3>Budget Details</h3>
</div>
    <div>
  <label>Project Area and Code:</label><br />
  <input
    type="text"
    name="projectCode"
    value={form.projectCode}
    onChange={handleChange}
    placeholder="e.g. 00000"
    required
  />
</div>

<div>
  <label>Activity Code:</label><br />
  <input
    type="text"
    name="activityCode"
    value={form.activityCode}
    onChange={handleChange}
    placeholder="e.g. 00000"
    required
  />
</div>

<div>
  <label>Payment Code:</label><br />
  <input
    type="text"
    name="paymentCode"
    value={form.paymentCode}
    onChange={handleChange}
    placeholder="e.g. 00000"
    required
  />
</div>

        {/* ITEMS SECTION */}
        <h3>Items</h3>

        {form.items.map((item, index) => (
          <div key={index} style={{
            marginBottom: "10px",
            border: "1px solid #ccc",
            padding: "10px"
          }}>

             <div>
              <label>Item Name:</label><br />
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>
          
                    <label>Category</label><br />

                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Category
                      </option>

                      <option value="ICT Equipment">
                        ICT Equipment
                      </option>

                      <option value="Office Supplies">
                        Office Supplies
                      </option>

                      <option value="Furniture">
                        Furniture
                      </option>

                      <option value="Vehicle Maintenance">
                        Vehicle Maintenance
                      </option>

                      <option value="Cleaning Materials">
                        Cleaning Materials
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

            <div>
              <label>Item Description:</label><br />
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>

            <div>
              <label>Quantity:</label><br />
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>
            
            <div>
              <label>Estimated Cost Per Item:</label><br />
              <input
                type="number"
                name="cost"
                value={item.cost}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>
             <div>
              <label>Line Total</label><br />
              <input
                type="number"
                value={calculateItemTotal(item)}
                readOnly
              />
            </div>
            <br />

            {form.items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)}>
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add Another Item
        </button>

        {/* Estimated Total */}
        <div>
          <label>Estimated Total:</label><br />
          <input value={calculateTotal()} disabled />
        </div>

        {/* Status */}
        <div>
          <label>Status:</label><br />
          <input value={form.status} disabled />
        </div>
        <br /> 

<h3>Attachment (Optional)</h3>

<div style={{ marginBottom: "20px" }}>
  <label>Upload File:</label><br />
  <input type="file" onChange={handleFileChange} />
</div>

{form.attachment && (
  <p style={{ marginBottom: "20px" }}>
    Selected File: {form.attachment.name}
  </p>
)}

<button type="submit" style={{ marginTop: "25px" }}>
  {isEditing ? "Update Request" : "Submit Request"}
</button>

  {isEditing && (
    <button
      type="button"
      onClick={() => navigate("/my-requests")}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  )}
      </form>

    </div>
  );
}