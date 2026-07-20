const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("ROLE:", req.body.role);
    const {
      fullName,
      email,
      role,
      department,
      supervisor,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const tempPassword =
      "Temp@" +
      Math.floor(
        1000 + Math.random() * 9000
      );

    const hashedPassword =
      await bcrypt.hash(
        tempPassword,
        10
      );
      console.log(
  User.schema.path("role").enumValues
);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      department,
      supervisor: supervisor || null,
      mustChangePassword: true,
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      tempPassword,
      user,
    });
 } catch (error) {

  console.error(
    "CREATE USER ERROR:",
    error
  );

  res.status(500).json({
    message: error.message,
  });
}
};

const getSupervisors = async (
  req,
  res
) => {
  try {
const supervisors =
  await User.find({
    role: {
      $in: [
        "supervisor",
        "national_director",
      ],
    },
    isActive: true,
  }).select(
    "_id fullName email"
  );

    res.status(200).json(
      supervisors
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const blockUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = false;

    await user.save();

    res.status(200).json({
      message:
        "User blocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const unblockUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = true;

    await user.save();

    res.status(200).json({
      message:
        "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const resetPassword = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const tempPassword =
      "Temp@" +
      Math.floor(
        1000 + Math.random() * 9000
      );

    user.password =
      await bcrypt.hash(
        tempPassword,
        10
      );

    user.mustChangePassword = true;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully",
      tempPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("supervisor", "fullName email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE USER
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("supervisor", "fullName email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
      const {
        fullName,
        email,
        role,
        department,
        supervisor,
        isActive,
        canCreateRequests,
      } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.department = department || user.department;
    user.supervisor = supervisor || user.supervisor;

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    if (
          typeof canCreateRequests ===
          "boolean"
        ) {
          user.canCreateRequests =
            canCreateRequests;
        }
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",

      user: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role,
          department:
            updatedUser.department,
          supervisor:
            updatedUser.supervisor,
          isActive:
            updatedUser.isActive,
          canCreateRequests:
            updatedUser.canCreateRequests,
        },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getSupervisors,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  resetPassword,
  deleteUser,
};