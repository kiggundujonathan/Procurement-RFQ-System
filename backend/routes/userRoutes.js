const express = require("express");

const {
  createUser,
  getUsers,
  getSupervisors,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  resetPassword,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// USERS
router.get(
  "/",
  protect,
  authorize("administrator"),
  getUsers
);

router.get(
  "/supervisors",
  protect,
  authorize("administrator"),
  getSupervisors
);

router.get(
  "/:id",
  protect,
  authorize("administrator"),
  getUserById
);

router.post(
  "/",
  protect,
  authorize("administrator"),
  createUser
);

router.put(
  "/:id",
  protect,
  authorize("administrator"),
  updateUser
);

// BLOCK / UNBLOCK
router.put(
  "/:id/block",
  protect,
  authorize("administrator"),
  blockUser
);

router.put(
  "/:id/unblock",
  protect,
  authorize("administrator"),
  unblockUser
);

// PASSWORD RESET
router.put(
  "/:id/reset-password",
  protect,
  authorize("administrator"),
  resetPassword
);

// DELETE
router.delete(
  "/:id",
  protect,
  authorize("administrator"),
  deleteUser
);

module.exports = router;