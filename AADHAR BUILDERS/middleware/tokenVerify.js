const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyAdminToken = async function (req, res, next) {
  try {
    // console.log(process.env.ADMIN_SECRET_KEY);

    let expired = null;
    const bearerHeader = req.headers["authorization"];
    let bearerToken = "";
    if (bearerHeader) {
      bearerToken = bearerHeader.split(" ")[1];
    }

    if (bearerToken) {
      jwt.verify(
        bearerToken,
        process.env.ADMIN_SECRET_KEY,
        function (err, decoded) {
          if (err) {
            try {
              expired = err;
              res.status(400).json({ message: "token expired", expired });
            } catch (err) {
              res.status(400).json({ message: "token expired", err });
            }
          }
          if (decoded) {
            req.userId = decoded.userId;
            // console.log(req.userId);
            next();
          }
        }
      );
    } else {
      res.status(400).json({ message: "Bearer token not defined" });
    }
  } catch (err) {
    console.log("eror", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: err.message });
    }

    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
