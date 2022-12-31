const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: 3,
      index: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    hash_password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 24
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    countrtyCode: {
      type: String
    },
    contactNumber: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  }
};

module.exports = mongoose.model("users", userSchema);
