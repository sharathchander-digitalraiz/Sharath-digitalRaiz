const { check, validationResult } = require("express-validator");

exports.validataddSummary = [
  check("summaryNumber").notEmpty().withMessage("Please enter summary number"),
  check("description")
    .notEmpty()
    .withMessage("Please write some description about the city"),
  check("shapeCut").notEmpty().withMessage("Please enter shape cut"),
  check("totalEstWt")
    .notEmpty()
    .withMessage("Please enter total estimated weight"),
  check("color").notEmpty().withMessage("Please enter color"),
  check("clarity").notEmpty().withMessage("Please enter clarity"),
  check("comment").notEmpty().withMessage("Please write comment"),
];

exports.isRequestvalidataddSummary = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res
      .status(400)
      .json({ message: errors.array()[0].msg, success: false, login: true });
  }
  next();
};
