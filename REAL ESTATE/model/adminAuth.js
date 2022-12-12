const mongoose = require("mongoose");
// const m2s = require("mongoose-to-swagger");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 500,
      trim: true,
      index: true,
      required: true
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 500,
      trim: true,
      index: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "sales", "accounts"],
      default: "superadmin",
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: "uploads/public/aadharLogo.png"
    },
    address: {
      type: String,
      minlength: [5, "Please enter at least 5 character"]
    },
    status: {
      type: Boolean,
      enum: [false, true],
      default: true
    },
    isDelete: {
      type: Boolean,
      enum: [false, true],
      default: false
    }
  },
  {
    timestamps: true
  }
);

adminSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("admins", adminSchema);
