const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminUser = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hash_password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 24,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    status: {
      type: Boolean,
      enum: [false, true],
    },
  },
  {
    timestamps: true,
  }
);

adminUser.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

adminUser.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  },
};

module.exports = mongoose.model("adminUsers", adminUser);
