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

import { saveAs } from "file-saver";

export default function RequestDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  

  const request = location.state?.request;

  if (!request) {
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

  doc.text("APPROVAL HISTORY", 10, y);

  y += 10;

  doc.setFont("helvetica", "normal");

  request.approvalHistory?.forEach((item) => {
    doc.text(
      `${item.role} - ${item.action} - ${item.date}`,
      10,
      y
    );

    y += 7;
  });

  y += 10;

  // SIGNATURES
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

y += 10;

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
<div>
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => navigate(-1)}>
        Back
      </button>

      <button
        onClick={downloadPDF}
        style={{ marginLeft: "10px" }}
      >
        Download PDF
      </button>

      <button
        onClick={downloadWord}
        style={{ marginLeft: "10px" }}
      >
        Download Word
      </button>
    </div>


      <h2>{request.requestTitle}</h2>

      <p>
        <strong>Request ID:</strong> {request.requestId}
      </p>

      <p>
        <strong>Status:</strong> {request.status}
      </p>

      <p>
        <strong>Requestor:</strong> {request.requestor}
      </p>

      <p>
        <strong>Project Code:</strong> {request.projectCode}
      </p>

      <p>
        <strong>Activity Code:</strong> {request.activityCode}
      </p>
      <p><strong>Payment Code: </strong>{request.paymentCode}</p>
     <h3>Items</h3>

{request.items?.map((item, index) => {
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
          <strong>Category:</strong>{" "}
          {item.category}
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

    </div>
  );
})}
      <h3>Financial Summary</h3>
<p>
  <strong>Estimated Total:</strong>{" "}
  {Number(request.estimatedTotal).toLocaleString()}
</p>

      <h3>Attachment</h3>

      <p>
        {request.attachment?.name || "No attachment"}
      </p>

      {request.attachment?.data && (
        <button
          onClick={() => handleDownload(request.attachment)}
        >
          Download Attachment
        </button>
      )}

      <br />

      <h3>Approval History</h3>

{request.approvalHistory?.length > 0 ? (
  request.approvalHistory.map((item, index) => (
    <div
      key={index}
      style={{
        borderBottom: "1px solid #ddd",
        marginBottom: "10px",
      }}
    >
      <p>
        <strong>Role:</strong> {item.role}
      </p>

      <p>
        <strong>Action:</strong> {item.action}
      </p>

      <p>
        <strong>Comment:</strong> {item.comment}
      </p>

      <p>
        <strong>Date:</strong> {item.date}
      </p>
    </div>
  ))
) : (
  <p>No approval history available.</p>
)}
      <br />

      
    </div>
  );
}