const RFQ = require("../models/RFQ");
const User = require("../models/User");

// Generate Request ID
const generateRequestId = () => {
  const random = Math.floor(Math.random() * 10000);
  return `GOR-${new Date().getFullYear()}-${random}`;
};

// CREATE REQUEST
const createRFQ = async (req, res) => {
  try {
    const {
      requestTitle,
      description,
      estimatedTotal,
      items = [],
      projectCode = "",
      activityCode = "",
      paymentCode = "",
      attachments = [],
    } = req.body;

    const requestor = await User.findById(
      req.user._id
    );

    if (!requestor) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const request = await RFQ.create({
      requestId: generateRequestId(),

      requestTitle,

      description,

      estimatedTotal,

      department: requestor.department,

      requestedBy: requestor._id,

      supervisor: requestor.supervisor,

      projectCode,

      activityCode,

      paymentCode,

      items,

      attachments,

      status: "Draft",

      currentStage: "finance",
    });

    res.status(201).json({
      message:
        "Request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// MY REQUESTS
const getMyRFQs = async (req, res) => {
  try {
    const requests = await RFQ.find({
      requestedBy: req.user._id,
    })
      .populate(
        "requestedBy",
        "fullName email department"
      )
      .populate(
        "supervisor",
        "fullName email"
      );

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// GET SINGLE REQUEST
const getRFQById = async (req, res) => {
  try {
    const request = await RFQ.findById(req.params.id)
      .populate(
        "requestedBy",
        "fullName email department"
      )
      .populate(
        "supervisor",
        "fullName email"
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FINANCE QUEUE
const getFinanceQueue = async (req, res) => {
  try {
    console.log("FINANCE QUEUE CALLED");

    const requests = await RFQ.find()
      .populate(
        "requestedBy",
        "fullName email department"
      )
      .populate(
        "supervisor",
        "fullName email"
      ).sort({ createdAt: -1 });

    console.log(
      "Finance Requests:",
      JSON.stringify(requests, null, 2)
    );

    res.status(200).json(requests);
  } catch (error) {
    console.error(
      "FINANCE QUEUE ERROR:"
    );

    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// FINANCE APPROVE
const financeApprove = async (req, res) => {
  try {
    const { comments } = req.body;

    const request = await RFQ.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status =
      "Budget Approved";

    request.currentStage =
      "supervisor";

    request.financeApproval = {
      approved: true,
      approvedBy: req.user._id,
      comments,
      date: new Date(),
    };

    request.approvalHistory.push({
      stage: "Finance",
      action: "Approved",
      performedBy: req.user._id,
      comments,
    });

    await request.save();

    res.status(200).json({
      message:
        "Budget approved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// DELETE REQUEST
const deleteRFQ = async (req, res) => {
  try {
    const request = await RFQ.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Only owner can delete
    if (
      request.requestedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own request",
      });
    }

    // Only Draft requests can be deleted
    if (request.status !== "Draft") {
      return res.status(400).json({
        message:
          "Only Draft requests can be deleted",
      });
    }

    await RFQ.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FINANCE REJECT
const financeReject = async (
  req,
  res
) => {
  try {
    const { comments } = req.body;

    const request = await RFQ.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status =
      "Budget Rejected";

    request.currentStage =
      "finance";

    request.financeApproval = {
      approved: false,
      approvedBy: req.user._id,
      comments,
      date: new Date(),
    };

    request.approvalHistory.push({
      stage: "Finance",
      action: "Rejected",
      performedBy: req.user._id,
      comments,
    });

    await request.save();

    res.status(200).json({
      message:
        "Budget rejected successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SUPERVISOR QUEUE
const getSupervisorQueue =
  async (req, res) => {
    try {
      console.log("LOGGED IN USER:",req.user._id);

      const requests =
        await RFQ.find({
          supervisor:
            req.user._id,
        })
          .populate(
            "requestedBy",
            "fullName email department"
          )
          .populate(
            "supervisor",
            "fullName email"
          )
          .sort({ createdAt: -1 });

              console.log(
                "SUPERVISOR REQUESTS:",
                requests.length
              );
              console.log(JSON.stringify(requests,null,2));
      res.status(200).json(
        requests
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// SUPERVISOR APPROVE
const supervisorApprove =
  async (req, res) => {
    try {
      const { comments } =
        req.body;

      const request =
        await RFQ.findById(
          req.params.id
        );

      if (!request) {
        return res
          .status(404)
          .json({
            message:
              "Request not found",
          });
      }

      if (
        request.requestedBy.toString() ===
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "You cannot approve your own request",
          });
      }

      request.status =
        "Supervisor Approved";

      request.currentStage =
        "procurement";

      request.supervisorApproval =
        {
          approved: true,
          approvedBy:
            req.user._id,
          comments,
          date: new Date(),
        };

      request.approvalHistory.push(
        {
          stage:
            "Supervisor",
          action:
            "Approved",
          performedBy:
            req.user._id,
          comments,
        }
      );

      await request.save();

      res.status(200).json({
        message:
          "Request approved successfully",
        request,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// SUPERVISOR REJECT
const supervisorReject =
  async (req, res) => {
    try {
      const { comments } =
        req.body;

      const request =
        await RFQ.findById(
          req.params.id
        );

      if (!request) {
        return res
          .status(404)
          .json({
            message:
              "Request not found",
          });
      }

      request.status =
        "Supervisor Rejected";

      request.currentStage =
        "finance";

      request.supervisorApproval =
        {
          approved: false,
          approvedBy:
            req.user._id,
          comments,
          date: new Date(),
        };

      request.approvalHistory.push(
        {
          stage:
            "Supervisor",
          action:
            "Rejected",
          performedBy:
            req.user._id,
          comments,
        }
      );

      await request.save();

      res.status(200).json({
        message:
          "Request rejected successfully",
        request,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// PROCUREMENT QUEUE
const getProcurementQueue =
  async (req, res) => {
    try {
      const requests =
  await RFQ.find({
    $or: [
      {
        currentStage: "procurement",
      },
      {
        status:
          "Supervisor Approved",
      },
      {
        status: "Approved",
      },
      {
        status:
          "Procurement Rejected",
      },
    ],
  })
          .populate(
            "requestedBy",
            "fullName email department"
          )
          .populate(
            "supervisor",
            "fullName email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        requests
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// PROCUREMENT APPROVE
const processRFQ = async (
  req,
  res
) => {
  try {
    const { comments } = req.body;

    const request =
      await RFQ.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json(
        {
          message:
            "Request not found",
        }
      );
    }

    request.status =
      "Approved";

    request.currentStage =
      "completed";

    request.procurementApproval =
      {
        approved: true,
        approvedBy:
          req.user._id,
        comments,
        date: new Date(),
      };

    request.approvalHistory.push(
      {
        stage:
          "Procurement",
        action:
          "Approved",
        performedBy:
          req.user._id,
        comments,
      }
    );

    await request.save();

    res.status(200).json({
      message:
        "Request approved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
const procurementReject = async (
  req,
  res
) => {
  try {
    const { comments } = req.body;

    const request =
      await RFQ.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Request not found",
      });
    }

    request.status =
      "Procurement Rejected";

    request.currentStage =
      "finance";

    request.procurementApproval = {
      approved: false,
      approvedBy: req.user._id,
      comments,
      date: new Date(),
    };

    request.approvalHistory.push({
      stage: "Procurement",
      action: "Rejected",
      performedBy: req.user._id,
      comments,
    });

    await request.save();

    res.status(200).json({
      message:
        "Request rejected successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
// UPDATE REQUEST / RESUBMIT
const updateRFQ = async (req, res) => {
  try {
    const request = await RFQ.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Only owner can edit
    if (
      request.requestedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own request",
      });
    }

    request.requestTitle =
      req.body.requestTitle;

    request.description =
      req.body.description;

    request.estimatedTotal =
      req.body.estimatedTotal;

    request.projectCode =
      req.body.projectCode;

    request.activityCode =
      req.body.activityCode;

    request.paymentCode =
      req.body.paymentCode;

    request.items =
      req.body.items || [];

    request.attachments =
      req.body.attachments || [];

    // IMPORTANT
    // Rejected requests become Draft again
    request.status = "Draft";

    request.currentStage =
      "finance";

    await request.save();

    res.status(200).json({
      message:
        "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await RFQ.find()
        .populate(
          "requestedBy",
          "fullName email department"
        )
        .populate(
          "supervisor",
          "fullName email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      requests
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
console.log(
  "EXPORT TEST:",
  typeof getAllRequests
);
module.exports = {
  createRFQ,
  updateRFQ,
  deleteRFQ,
  getRFQById,
  getMyRFQs,
  getFinanceQueue,
  financeApprove,
  financeReject,
  getSupervisorQueue,
  supervisorApprove,
  supervisorReject,
  getProcurementQueue,
  processRFQ,
  procurementReject,
  getAllRequests,
};