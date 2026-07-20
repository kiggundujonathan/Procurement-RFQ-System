const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "User account is blocked",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,

      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        supervisor: user.supervisor,
        isActive: user.isActive,
        canCreateRequests:
          user.canCreateRequests,
      },

      mustChangePassword:
        user.mustChangePassword,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!match) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.mustChangePassword =
      false;

    user.lastPasswordChange =
      new Date();

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
module.exports = {
  login,
  changePassword,
};