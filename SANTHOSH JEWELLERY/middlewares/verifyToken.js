const jwt = require("jsonwebtoken");
require("dotenv").config();

//jwt token verification for the every request assigned
exports.verifyToken = async function (req, res, next) {
  try {
    let expired = null;
    const bearerHeader = req.headers["authorization"];
    let bearerToken = "";
    if (bearerHeader) {
      bearerToken = bearerHeader.split(" ")[1];
    }
    if (bearerToken) {
      jwt.verify(
        bearerToken,
        "process.env.SJ_VERIFY_TOKEN",
        function (err, decoded) {
          if (err) {
            try {
              expired = err;
              res
                .status(401)
                .json({ status: 401, message: "token expired", expired });
            } catch (err) {
              res
                .status(401)
                .json({ status: 401, message: "token expired", err });
            }
          }
          if (decoded) {
            req.admin = decoded._id;
            next();
          }
        }
      );
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Bearer token not defined" });
    }
  } catch (err) {
    console.log("eror", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ status: 401, message: err.message });
    }
    res
      .status(401)
      .json({ status: 401, message: "Internal Server Error", error: err });
  }
};
