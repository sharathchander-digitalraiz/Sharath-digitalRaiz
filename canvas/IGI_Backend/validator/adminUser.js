const { check, validationResult } = require("express-validator");
exports.validateAdminUser = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  check("contactNumber").notEmpty().withMessage("Contact number is required"),
  check("address").notEmpty().withMessage("Addess is required"),
];

exports.isRequestvalidateAdminUser = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  next();
};
