const jwt = require("jsonwebtoken");
exports.requireSignin = (req, res, next) => {
  // console.log(req.headers);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "worldisfullofdevelopers", (err, data) => {
      if (err) {
        return res.status(400).json({
          success: false,
          login: false,
          message: "Session expired",
          data: []
        });
      } else {
        req.user = data;
        req.userId = data.user_id;
        // console.log(req.userId);
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      login: false,
      message: "Authorization required"
    });
  }
};
