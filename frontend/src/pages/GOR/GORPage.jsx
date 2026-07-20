import { useState, useEffect } from "react";
import { useContext } from "react";
import { RequestContext } from "../../context/RequestContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./GORPage.css";
import { FaTrash } from "react-icons/fa";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function GORPage() {
const navigate = useNavigate();
const { requests, setRequests } = useContext(RequestContext);
const { user } = useContext(AuthContext);
const location = useLocation();

// Get index from URL
const query = new URLSearchParams(location.search);
const editId = query.get("edit");
const isEditing = editId !== null;


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
    requestor: user?.fullName || "",
    department: user?.department || "",
    // category: "",
    dateSubmitted: "",
   // budgetCode: "",
    status: "Draft",
   items: [
  {
    name: "",
    category: "",
    description: "",
    quantity: "",
    cost: "",
  }
],
    attachments:[],
    Comments: []
  });

  // Initialize auto fields

useEffect(() => {
  setForm((prev) => ({
    ...prev,
    requestId: generateRequestId(),
    dateSubmitted: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));
}, []);

useEffect(() => {
  const loadRequest = async () => {
    if (!editId) return;

    try {
      const response = await api.get(
        `/rfqs/${editId}`
      );

      setForm(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadRequest();
}, [editId]);


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
    items: [
      ...form.items,
      {
        name: "",
        category: "",
        description: "",
        quantity: "",
        cost: ""
      }
    ]
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

const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);

  const filePromises = files.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          name: file.name,
          data: reader.result,
        });
      };

      reader.readAsDataURL(file);
    });
  });

  const uploadedFiles =
    await Promise.all(filePromises);

  setForm((prev) => ({
    ...prev,
    attachments: [
      ...(prev.attachments || []),
      ...uploadedFiles,
    ],
  }));
};
const handleSubmit = async (e) => {

  e.preventDefault();
  
  console.log(form);

if (!form.requestTitle?.trim()) {
    alert("Request Title is required.");
    return;
  }

  if (
    !form.projectCode?.trim() ||
    !form.activityCode?.trim() ||
    !form.paymentCode?.trim()
  ) {
    alert(
      "Please complete all Budget Details."
    );
    return;
  }

  if (form.items.length === 0) {
    alert("Please add at least one item.");
    return;
  }

  for (let i = 0; i < form.items.length; i++) {
    const item = form.items[i];

    if (!item.name?.trim()) {
      alert(
        `Item ${i + 1}: Item Name is required.`
      );
      return;
    }

    if (!item.category) {
      alert(
        `Item ${i + 1}: Please select a Category.`
      );
      return;
    }

    if (!item.description?.trim()) {
      alert(
        `Item ${i + 1}: Description is required.`
      );
      return;
    }

    if (
      !item.quantity ||
      Number(item.quantity) <= 0
    ) {
      alert(
        `Item ${i + 1}: Quantity must be greater than 0.`
      );
      return;
    }

    if (
      !item.cost ||
      Number(item.cost) <= 0
    ) {
      alert(
        `Item ${i + 1}: Unit Cost must be greater than 0.`
      );
      return;
    }
  }

  // SAVE REQUEST

  const submittedForm = {
    ...form,
    estimatedTotal: calculateTotal(),

    status: "Draft",
    comments: [],
    approvalHistory: [],
  };

  if (isEditing) {
    // UPDATE existing
     
await api.put(
  `/rfqs/${editId}`,
  {
    requestTitle: form.requestTitle,

    description: form.items
      .map(
        (item) =>
          `${item.name} - ${item.description}`
      )
      .join(", "),

    estimatedTotal:
      calculateTotal(),

    projectCode:
      form.projectCode,

    activityCode:
      form.activityCode,

    paymentCode:
      form.paymentCode,

    items: form.items,

    attachments:
      form.attachments,
  }
);

alert(
  "Request updated and resubmitted!"
);

navigate("/my-requests");

return;
} else {
  try {
    console.log(
  "SUBMITTING ATTACHMENTS:",
  form.attachments
);
    await api.post("/rfqs", {
      requestTitle: form.requestTitle,

      description: form.items
        .map(
          (item) =>
            `${item.name} - ${item.description}`
        )
        .join(", "),

      estimatedTotal: calculateTotal(),

      projectCode: form.projectCode,

      activityCode: form.activityCode,

      paymentCode: form.paymentCode,

      items: form.items.map((item) => ({
        ...item,
        lineTotal:
          (Number(item.quantity) || 0) *
          (Number(item.cost) || 0),
      })),

      attachments: form.attachments,
    });

    alert("Request submitted successfully.");

    navigate("/my-requests");

    return;
  } catch (error) {
    console.error(error);

    // alert(
    //   error.response?.data?.message ||
    //   "Failed to submit request"
    // );
    
console.log("ERROR:", error);
console.log("RESPONSE:", error.response);

alert(
  JSON.stringify(
    error.response?.data || error.message
  )
);


    return;
  }
}

  // reset form
  setForm({
    requestId: generateRequestId(),
    requestTitle: "",
 requestor: user?.fullName || "",
department: user?.department || "",
    // category: "",
    
dateSubmitted: new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}),
    projectCode: "",
    activityCode: "",
    paymentCode: "",
    status: "Draft",
    items: [{ name: "", description: "", quantity: "", cost: "" }],
    attachments:[],
    comments: []
  });
};
  return (
  <div className="gor-page">
    <h1 className="gor-title">
      Goods Order Request
    </h1>

    <p className="gor-subtitle">
      Submit a request for goods or items needed for work purposes.<br />
      Please provide complete and accurate details to ensure prompt processing
    </p>

    <form onSubmit={handleSubmit}>

      
      {/* Request Information */}
      <div className="gor-card">
        <h3 className="gor-section-title">
          Request Information
        </h3>

        <div className="gor-grid">
          <div>
            <label>Request ID</label>
            <input
              className="form-input"
              value={form.requestId}
              disabled
            />
          </div>

          <div>
            <label>Request Title</label>
            <input
              className="form-input"
              name="requestTitle"
              value={form.requestTitle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Requestor</label>
            <input
              className="form-input"
              value={form.requestor}
              disabled
            />
          </div>

          <div>
            <label>Department</label>
            <input
              className="form-input"
              value={form.department}
              disabled
            />
          </div>

          <div>
            <label>Date Submitted</label>
            <input
              className="form-input"
              value={form.dateSubmitted}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Budget Details */}
      <div className="gor-card">
        <h3 className="gor-section-title">
          Budget Details
        </h3>

        <div className="gor-grid">
          <div>
            <label>Project Code</label>

            <input
              className="form-input"
              name="projectCode"
              value={form.projectCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Activity Code</label>

            <input
              className="form-input"
              name="activityCode"
              value={form.activityCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Payment Code</label>

            <input
              className="form-input"
              name="paymentCode"
              value={form.paymentCode}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="gor-card">
        <h3 className="gor-section-title">
          Items
        </h3>

        {form.items.map((item, index) => (
              <div
        key={index}
        className="item-card"
        style={{
          position: "relative",
        }}
      >
                {form.items.length > 1 && (
  <button
    type="button"
    onClick={() => removeItem(index)}
    style={{
      position: "absolute",
      top: "15px",
      right: "15px",
      border: "none",
      background: "#FEE2E2",
      color: "#DC2626",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <FaTrash />
  </button>
)}
            <h4>
              Item {index + 1}
            </h4>

            <div className="gor-grid">
              <div>
                <label>Item Name</label>

                <input
                  className="form-input"
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      e
                    )
                  }
                />
              </div>

              <div>
                <label>Category</label>

                <select
  className="form-select"
  name="category"
  value={item.category || ""}
  onChange={(e) =>
    handleItemChange(index, e)
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
              </div>

              <div>
                <label>
                  Description
                </label>

                <input
                  className="form-input"
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      e
                    )
                  }
                />
              </div>

              <div>
                <label>
                  Quantity
                </label>

                <input
                  className="form-input"
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      e
                    )
                  }
                />
              </div>

              <div>
                <label>
                  Unit Cost
                </label>

                <input
                  className="form-input"
                  type="number"
                  name="cost"
                  value={item.cost}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      e
                    )
                  }
                />
              </div>

              <div>
                <label>
                  Line Total
                </label>

                <input
                  className="form-input"
                  readOnly
                  value={calculateItemTotal(
                    item
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="secondary-btn"
        >
          + Add Another Item
        </button>
        
      </div>
      

      {/* Financial Summary */}
      <div className="gor-card">
        <h3 className="gor-section-title">
          Financial Summary
        </h3>

        <input
          className="form-input"
          disabled
          value={`${calculateTotal().toLocaleString()} UGX`}
        />
      </div>

      {/* Attachment */}
      <div className="gor-card">
        <h3 className="gor-section-title">
          Attachments
        </h3>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
        />
       {form.attachments?.length > 0 && (
  <div>
    {form.attachments.map(
      (file, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span>{file.name}</span>

          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                attachments:
                  prev.attachments.filter(
                    (_, i) =>
                      i !== index
                  ),
              }));
            }}
            style={{
              background: "#FEE2E2",
              border: "none",
              color: "#DC2626",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      )
    )}
  </div>
)}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          type="submit"
          className="primary-btn"
        >
          {isEditing
            ? "Update Request"
            : "Submit Request"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate(
                "/my-requests"
              )
            }
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>
);
}