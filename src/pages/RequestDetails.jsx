import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { useContext } from "react";
import { RequestContext } from "../context/RequestContext";

import { saveAs } from "file-saver";

export default function RequestDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requests } = useContext(RequestContext);



const requestId =
  location.state?.requestId ||
  location.state?.request?.requestId;

const request = requests.find(
  (r) => r.requestId === requestId
);

console.log(location.state);

  if (!request) {
    console.log(request);
    return (
      <div>
        <h2>Request Not Found</h2>
           <button onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }
const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  let y = 15;

  // TITLE
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GOODS ORDER REQUEST", 105, y, {
    align: "center"
  });

  y += 15;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Request ID: ${request.requestId}`, 10, y);
  y += 7;

  doc.text(`Title: ${request.requestTitle}`, 10, y);
  y += 7;

  doc.text(`Requestor: ${request.requestor}`, 10, y);
  y += 7;
  doc.text(`Project Code: ${request.projectCode}`, 10, y);
  y += 7;
    doc.text(`Activity Code: ${request.activityCode}`, 10, y);
  y += 7;
    doc.text(`Payment Code: ${request.paymentCode}`, 10, y);
  y += 7;
  doc.text(`Status: ${request.status}`, 10, y);
  y += 10;

 autoTable(doc, {
  startY: y,

  head: [[
    "#",
    "Item",
    "Category",
    "Description",
    "Qty",
    "Unit Cost",
    "Line Total"
  ]],

  body: request.items.map((item, index) => {
    const lineTotal =
      (Number(item.quantity) || 0) *
      (Number(item.cost) || 0);

    return [
      index + 1,
      item.name || "",
      item.category || "N/A",
      item.description || "",
      item.quantity || 0,
      Number(item.cost || 0).toLocaleString(),
      lineTotal.toLocaleString(),
    ];
  }),

  styles: {
    fontSize: 9,
    cellPadding: 3,
    overflow: "linebreak",
    valign: "middle",
  },

  headStyles: {
    fillColor: [220, 220, 220],
    textColor: 0,
    fontStyle: "bold",
  },

  columnStyles: {
    0: { cellWidth: 10 },
    1: { cellWidth: 25 },
    2: { cellWidth: 25 },
    3: { cellWidth: 60 },
    4: { cellWidth: 15 },
    5: { cellWidth: 25 },
    6: { cellWidth: 25 },
  },
});

y = doc.lastAutoTable.finalY + 10;

doc.setFont("helvetica", "bold");

doc.text(
  `Estimated Total: ${Number(
    request.estimatedTotal
  ).toLocaleString()} UGX`,
  130,
  y
);

y += 15;

  // APPROVAL HISTORY
doc.setFont("helvetica", "bold");
doc.text("APPROVAL HISTORY", 10, y);

y += 10;

request.approvalHistory?.forEach((item) => {
  doc.setFont("helvetica", "bold");

  doc.text(
    `Role: ${item.role}`,
    10,
    y
  );

  y += 7;

  doc.setFont("helvetica", "normal");

  doc.text(
    `Action: ${item.action}`,
    10,
    y
  );

  y += 7;

  doc.text(
    `Comment: ${
      item.comment || "N/A"
    }`,
    10,
    y
  );

  y += 7;

  doc.text(
    `Date: ${item.date}`,
    10,
    y
  );

  y += 12;
});

y += 5;

const financeRecord =
  request.approvalHistory?.find(
    (h) => h.role === "Finance"
  );

const supervisorRecord =
  request.approvalHistory?.find(
    (h) => h.role === "Supervisor"
  );

const procurementRecord =
  request.approvalHistory?.find(
    (h) => h.role === "Procurement"
  );

doc.setFont("helvetica", "bold");
doc.text("APPROVAL STATUS", 10, y);

y += 10;

doc.setFont("helvetica", "normal");

doc.text(
  `Finance: ${
    financeRecord
      ? financeRecord.action
      : "Budget Not Checked"
  }`,
  10,
  y
);

y += 10;

doc.text(
  `Supervisor: ${
    supervisorRecord
      ? supervisorRecord.action
      : "Not Approved"
  }`,
  10,
  y
);

y += 10;

doc.text(
  `Procurement: ${
    procurementRecord
      ? procurementRecord.action
      : "Not Approved"
  }`,
  10,
  y
);

  doc.save(
    `GOR_${request.requestId}.pdf`
  );
};

const downloadWord = async () => {
  const financeRecord =
    request.approvalHistory?.find(
      (h) => h.role === "Finance"
    );

  const supervisorRecord =
    request.approvalHistory?.find(
      (h) => h.role === "Supervisor"
    );

  const procurementRecord =
    request.approvalHistory?.find(
      (h) => h.role === "Procurement"
    );

    const itemsTable = new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },

  rows: [
    // Header Row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("#")],
        }),

        new TableCell({
          children: [new Paragraph("Item")],
          size: 30,
        }),
        
        new TableCell({
          children: [new Paragraph("Category")],
        }),

        new TableCell({
          children: [new Paragraph("Description")],
          size: 30,
        }),

        new TableCell({
          children: [new Paragraph("Qty")],
        }),

        new TableCell({
          children: [new Paragraph("Unit Cost")],
        }),

        new TableCell({
          children: [new Paragraph("Line Total")],
        }),
      ],
    }),

    // Data Rows
    ...request.items.map((item, index) => {
      const lineTotal =
        (Number(item.quantity) || 0) *
        (Number(item.cost) || 0);

      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph(`${index + 1}`),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph(item.name),
            ],
          }),
          
            new TableCell({
              children: [
                new Paragraph(item.category || "N/A"),
              ],
            }),

          new TableCell({
            children: [
              new Paragraph(
                item.description
              ),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph(
                `${item.quantity}`
              ),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph(
                Number(
                  item.cost
                ).toLocaleString()
              ),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph(
                lineTotal.toLocaleString()
              ),
            ],
          }),
        ],
      });
    }),
  ],
});


  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "GOODS ORDER REQUEST",
            heading: HeadingLevel.TITLE,
          }),

          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: `Request ID: ${request.requestId}`,
                size: 28,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Title: ${request.requestTitle}`,
                size: 28,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Requestor: ${request.requestor}`,
                size: 28,
              }),
            ],
          }),
   
          new Paragraph({
            children: [
              new TextRun({
                text: `Project Code: ${request.projectCode}`,
                size: 28,
              }),
            ],
          }),
                    new Paragraph({
            children: [
              new TextRun({
                text: `Activity Code: ${request.activityCode}`,
                size: 28,
              }),
            ],
          }),
                    new Paragraph({
            children: [
              new TextRun({
                text: `Payment Code: ${request.paymentCode}`,
                size: 28,
              }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Status: ${request.status}`,
                size: 28,
              }),
            ],
          }),

          new Paragraph(""),

          new Paragraph({
  text: "ITEMS",
  heading: HeadingLevel.HEADING_1,
}),

itemsTable,

new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: `Estimated Total: ${Number(
                  request.estimatedTotal
                ).toLocaleString()} UGX`,
                size: 30,
                bold: true,
              }),
            ],
          }),

          new Paragraph(""),

          new Paragraph({
            text: "APPROVAL HISTORY",
            heading: HeadingLevel.HEADING_1,
          }),

          ...(request.approvalHistory || []).flatMap(
            (history) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Role: ${history.role}`,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Action: ${history.action}`,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Comment: ${history.comment}`,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Date: ${history.date}`,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),
            ]
          ),

          new Paragraph({
            text: "APPROVAL STATUS",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Finance: ${
                  financeRecord
                    ? financeRecord.action
                    : "Not Approved"
                }`,
                size: 28,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Supervisor: ${
                  supervisorRecord
                    ? supervisorRecord.action
                    : "Not Approved"
                }`,
                size: 28,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Procurement: ${
                  procurementRecord
                    ? procurementRecord.action
                    : "Not Approved"
                }`,
                size: 28,
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  saveAs(
    blob,
    `GOR_${request.requestId}.docx`
  );
};

  const handleDownload = (attachment) => {
    if (!attachment?.data) return;

    const a = document.createElement("a");
    a.href = attachment.data;
    a.download = attachment.name;
    a.click();
  };
 return (
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    }}
  >
    {/* Header */}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color: "#1F2937",
          }}
        >
          Request Details
        </h1>

        <p
          style={{
            color: "#64748B",
            marginTop: "5px",
          }}
        >
          Review request information and approval history
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={secondaryBtn}
        >
          Back
        </button>

        <button
          onClick={downloadPDF}
          style={primaryBtn}
        >
          Download PDF
        </button>

        <button
          onClick={downloadWord}
          style={primaryBtn}
        >
          Download Word
        </button>
      </div>
    </div>

    {/* Request Info */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>
        Request Information
      </h3>

      <div style={infoGrid}>
        <InfoItem
          label="Request ID"
          value={request.requestId}
        />

        <InfoItem
          label="Title"
          value={request.requestTitle}
        />

        <InfoItem
          label="Status"
          value={request.status}
        />

        <InfoItem
          label="Requestor"
          value={request.requestor}
        />

        <InfoItem
          label="Project Code"
          value={request.projectCode}
        />

        <InfoItem
          label="Activity Code"
          value={request.activityCode}
        />

        <InfoItem
          label="Payment Code"
          value={request.paymentCode}
        />
      </div>
    </div>

    {/* Items */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>Items</h3>

      <div
        style={{
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
            <tr
              style={{
                background: "#F8FAFC",
              }}
            >
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Unit Cost</th>
              <th style={thStyle}>Line Total</th>
            </tr>
          </thead>

          <tbody>
            {request.items?.map(
              (item, index) => {
                const lineTotal =
                  (Number(item.quantity) || 0) *
                  (Number(item.cost) || 0);

                return (
                  <tr key={index}>
                    <td style={tdStyle}>
                      {item.name}
                    </td>

                    <td style={tdStyle}>
                      {item.category}
                    </td>

                    <td style={tdStyle}>
                      {item.description}
                    </td>

                    <td style={tdStyle}>
                      {item.quantity}
                    </td>

                    <td style={tdStyle}>
                      {Number(
                        item.cost
                      ).toLocaleString()}
                    </td>

                    <td style={tdStyle}>
                      {lineTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Financial Summary */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>
        Financial Summary
      </h3>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "700",
          color: "#3DA5F4",
        }}
      >
        UGX{" "}
        {Number(
          request.estimatedTotal
        ).toLocaleString()}
      </div>
    </div>

    {/* Attachment */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>
        Attachment
      </h3>

      <p>
        {request.attachment?.name ||
          "No attachment uploaded"}
      </p>

      {request.attachment?.data && (
        <button
          onClick={() =>
            handleDownload(
              request.attachment
            )
          }
          style={primaryBtn}
        >
          Download Attachment
        </button>
      )}
    </div>

    {/* Comments */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>
        Comments
      </h3>

      {request.comments?.length >
      0 ? (
        request.comments.map(
          (comment, index) => (
            <div
              key={index}
              style={{
                border:
                  "1px solid #E5E7EB",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "10px",
                background:
                  "#F8FAFC",
              }}
            >
              <strong>
                {comment.by}
              </strong>

              <p>
                {comment.text}
              </p>

              <small>
                {comment.date}
              </small>
            </div>
          )
        )
      ) : (
        <p>No comments available.</p>
      )}
    </div>

    {/* Approval History */}

    <div style={cardStyle}>
      <h3 style={sectionTitle}>
        Approval History
      </h3>

      {request.approvalHistory
        ?.length > 0 ? (
        request.approvalHistory.map(
          (item, index) => (
            <div
              key={index}
              style={{
                borderLeft:
                  "4px solid #3DA5F4",
                paddingLeft:
                  "15px",
                marginBottom:
                  "15px",
              }}
            >
              <strong>
                {item.role}
              </strong>

              <p>
                {item.action}
              </p>

              <p>
                {item.comment}
              </p>

              <small>
                {item.date}
              </small>
            </div>
          )
        )
      ) : (
        <p>
          No approval history
          available.
        </p>
      )}
    </div>
  </div>
);
}
const cardStyle = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  color: "#3DA5F4",
  marginBottom: "20px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #E5E7EB",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #E5E7EB",
};

const primaryBtn = {
  background: "#3DA5F4",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "10px 18px",
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#FFFFFF",
  color: "#3DA5F4",
  border: "1px solid #3DA5F4",
  borderRadius: "8px",
  padding: "10px 18px",
  cursor: "pointer",
};

function InfoItem({
  label,
  value,
}) {
  return (
    <div>
      <div
        style={{
          color: "#64748B",
          fontSize: "13px",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: "600",
        }}
      >
        {value || "N/A"}
      </div>
    </div>
    
  );

}
