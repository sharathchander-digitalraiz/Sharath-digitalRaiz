const SecurityDeposite = require("../../model/securityDeposit");

exports.addSecurityDeposit = async (req, res) => {
  try {
    const customerDpositAdded = new SecurityDeposite({
      bookingId: req.body.bookingId,
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      securityDepositStatus: req.body.securityDepositStatus,
      securityDeposite: req.body.securityDeposite,
      RegistNumber: req.body.RegistNumber,
      RegistImage: req.file.path,
      depositeAmount: req.body.depositeAmount,
      logDateCreated: new Date().toUTCString(),
    }).save((err, data) => {
      if (data) {
        res
          .status(200)
          .json({ success: true, message: "successfully added data" });
      } else {
        res.status(400).json({ success: false, message: "Bad Request", err });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" });
  }
};

//GET SECURITY DEPOSIT
exports.getSecurityDeposit = async (req, res) => {
  try {
    const customerDposit = await SecurityDeposite.findById(
      { _id: req.params.id },
      {
        depositeAmount: 1,
        securityDepositReturn: 1,
        securityDeposite: 1,
        RegistNumber: 1,
        RegistImage: 1,
      }
    );
    if (customerDposit) {
      res.status(200).json({
        success: true,
        message: "successfully retrieved data",
        customerDposit,
      });
    } else {
      res.status(400).json({ success: false, message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" });
  }
};

//GET SECURITY DEPOSIT BY TOKEN
exports.getSecurityDepositBytoken = async (req, res) => {
  try {
    const customerDposit = await SecurityDeposite.findOne(
      { customerId : req.userId },
      {
        depositeAmount: 1,
        securityDepositReturn: 1,
        securityDeposite: 1,
        RegistNumber: 1,
        RegistImage: 1,
      }
    );
    if (customerDposit) {
      res.status(200).json({
        success: true,
        message: "successfully retrieved data",
        customerDposit,
      });
    } else {
      res.status(400).json({ success: false, message: "Bad Request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" });
  }
};

// exports.getSecurityDepositBytoken = async (req, res) => {
//   //console.log(req.userId);
//   try {
//     const customerDposit = await SecurityDeposite.aggregate([
//       {
//         $match: { customerId: mongoose.Types.ObjectId(req.userId) },
//       },
//       {
//         $lookup: {
//           from: "cars", // other table name
//           localField: "carId", // name of users table field
//           foreignField: "_id", // name of userinfo table field
//           as: "carsDetails", // alias for userinfo table
//         },
//       },
//       { $unwind: "$carsDetails" },
//       {
//         $project: {
//             depositeAmount: 1,
//             securityDepositReturn: 1,
//             securityDeposite: 1,
//             RegistNumber: 1,
//             RegistImage: 1,
//         },
//       },
//     ]);
//     //    { _id: req.userId },
//     //     {
//         //   depositeAmount: 1,
//         //   securityDepositReturn: 1,
//         //   securityDeposite: 1,
//         //   RegistNumber: 1,
//         //   RegistImage: 1,
//     //     }
//     //   );
//     if (customerDposit) {
//       res.status(200).json({
//         success: true,
//         message: "successfully retrieved data",
//         customerDposit,
//       });
//     } else {
//       res.status(400).json({ success: false, message: "Bad Request" });
//     }
//   } catch (err) {
//     res.status(400).json({ success: false, message: "something went wrong" });
//   }
// };
