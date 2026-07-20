const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },

    requestTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    estimatedTotal: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    currentStage: {
      type: String,
      enum: [
        "finance",
        "supervisor",
        "procurement",
        "completed",
      ],
      default: "finance",
    },

    status: {
      type: String,
      enum: [
        "Draft",

        "Budget Approved",
        "Budget Rejected",

        "Supervisor Approved",
        "Supervisor Rejected",

        "Approved",
        "Procurement Rejected",
      ],
      default: "Draft",
    },

    projectCode: {
      type: String,
      default: "",
    },

    activityCode: {
      type: String,
      default: "",
    },

    paymentCode: {
      type: String,
      default: "",
    },

    attachments: [
  {
    name: String,
    data: String,
  },
],


    comments: [
      {
        comment: String,
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    approvalHistory: [
      {
        stage: String,
        action: String,

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        comments: String,

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    items: [
      {
        name: String,

        category: String,

        description: String,

        quantity: Number,

        cost: Number,

        lineTotal: Number,
      },
    ],

    financeApproval: {
      approved: {
        type: Boolean,
        default: false,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      comments: String,

      date: Date,
    },

    supervisorApproval: {
      approved: {
        type: Boolean,
        default: false,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      comments: String,

      date: Date,
    },

    procurementApproval: {
      approved: {
        type: Boolean,
        default: false,
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      comments: String,

      date: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RFQ", rfqSchema);