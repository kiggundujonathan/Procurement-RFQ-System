const mongoose = require("mongoose");

console.log("USER MODEL LOADED");
console.log("USER MODEL PATH:", __filename);
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
  type: String,
  enum: [
    "administrator",
    "finance",
    "procurement",
    "supervisor",
    "requestor",
    "national_director",
  ],
  required: true,
},


    department: {
      type: String,
      required: true,
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
        canCreateRequests: {
          type: Boolean,
          default: true,
        },
    isActive: {
      type: Boolean,
      default: true,
    },

mustChangePassword: {
  type: Boolean,
  default: true,
},

lastPasswordChange: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);
console.log(
  "ROLE ENUM:",
  userSchema.path("role").enumValues
);
module.exports = mongoose.model("User", userSchema);