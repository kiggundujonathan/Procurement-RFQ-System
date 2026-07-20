const express = require("express");

const {
  login,
  changePassword,
} = require("../controllers/authController");

const router = express.Router();

const protect =require("../middleware/authMiddleware");

router.post("/login", login);

router.put("/change-password"
  ,protect,
  changePassword);

module.exports = router;