const express = require("express");
console.log("RFQ Routes Loaded");
const {
  createRFQ,
  getMyRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
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
} = require("../controllers/rfqController");
console.log("getAllRequests =", getAllRequests);
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Requestor Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  createRFQ
);
router.get(
  "/my",
  protect,
  getMyRFQs
);
//console.log("UPDATING ATTACHMENTS:", form.attachments);
router.put(
  "/:id",
  protect,
  updateRFQ
);

router.delete(
  "/:id",
  protect,
  deleteRFQ
);
/*
|--------------------------------------------------------------------------
| Finance Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/finance",
  protect,
  authorize("finance"),
  getFinanceQueue
);

router.put(
  "/:id/finance-approve",
  protect,
  authorize("finance"),
  financeApprove
);

router.put(
  "/:id/finance-reject",
  protect,
  authorize("finance"),
  financeReject
);

/*
|--------------------------------------------------------------------------
| Supervisor Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/supervisor",
  protect,
  authorize("supervisor","national_director"),
  getSupervisorQueue
);

router.put(
  "/:id/supervisor-approve",
  protect,
  authorize(
    "supervisor",
    "national_director"
  ),
  supervisorApprove
);

router.put(
  "/:id/supervisor-reject",
  protect,
  authorize(
    "supervisor",
    "national_director"
  ),
  supervisorReject
);

/*
|--------------------------------------------------------------------------
| Procurement Routes
|--------------------------------------------------------------------------
*/
router.put(
  "/:id/procurement-reject",
  protect,
  authorize("procurement"),
  procurementReject
);
router.get(
  "/procurement",
  protect,
  authorize("procurement"),
  getProcurementQueue
);

router.put(
  "/:id/process",
  protect,
  authorize("procurement"),
  processRFQ
);

// router.get(
//   "/admin/all",
//   protect,
//   authorize("administrator"),
//   getAllRequests
// );

router.get(
  "/admin/all",
  protect,
  getAllRequests
);

router.get(
  "/:id",
  protect,
  getRFQById
);


module.exports = router;