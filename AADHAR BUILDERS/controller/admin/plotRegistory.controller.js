const adminModel = require("../../model/adminAuth");
const customerModel = require("../../model/customer");
const plotModel = require("../../model/plot");
const plotRegistoryModel = require("../../model/plotRegistory");

const plotStageModel = require("../../model/plotStage");
const paymentModel = require("../../model/payment");
const projectNameModel = require("../../model/projectName");
const operationModel = require("../../model/operation");

// add plot registory
exports.addPlotRegistory = async function (req, res) {
  try {
    const userr = await adminModel.findOne({ _id: req.userId }, { role: 1 });

    if (userr.role == "superadmin") {
      const plott = await plotModel.findOne(
        { _id: req.body.plotId },
        { _id: 1, customerId: 1 }
      );

      const customerr = await customerModel.findOne(
        { _id: plott.customerId },
        {
          firstName: 1,
          lastName: 1,
          email: 1,
          contactNumber: 1,
          presentAddress: 1,
          permanentAddress: 1
        }
      );

      const registrObj = new plotRegistoryModel({
        plotId: req.body.plotId,
        customerId: plott.customerId,
        customerName: `${customerr.firstName} ${customerr.lastName}`,
        customerEmail: customerr.email,
        customerPhone: customerr.contactNumber,
        customerPresAddress: customerr.presentAddress,
        customerPermAddress: customerr.permanentAddress,
        registoryStatus: req.body.registoryStatus,
        remark: req.body.remark
      });

      registrObj.save(async function (erer, data) {
        if (erer) {
          return res
            .status(400)
            .json({ message: "Plot registory could not be completed" });
        }
        if (data) {
          if (req.body.registoryStatus == "completed") {
            const edittPlot = await plotModel.updateOne(
              { _id: plott._id },
              {
                $set: {
                  registoryStatus: req.body.registoryStatus,
                  remark: req.body.remark,
                  percentColorPay: "#FF6666" // Red
                }
              },
              { new: true }
            );
          } else if (
            req.body.registoryStatus == "pending" ||
            req.body.registoryStatus == "inProgress"
          ) {
            const editPlot = await plotModel.updateOne(
              { _id: plott._id },
              {
                $set: {
                  registoryStatus: req.body.registoryStatus,
                  remark: req.body.remark,
                  percentColorPay: "#880ED49C" // Violet
                }
              },
              { new: true }
            );
          } else {
            console.log("Nothing to update in plot model");
          }

          res
            .status(200)
            .json({ message: "Plot registory Status upadated successfully" });
        }
      });
    } else {
      return res.status(400).json({ message: "Invalid authorization" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
// get all plot registory list
exports.getAllPlotRegistories = async function (req, res) {
  try {
    const registoriesResult = await plotRegistoryModel
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", registoriesResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update registory status
exports.updatePlotRegistoryStatus = async function (req, res) {
  try {
    const userr = await adminModel.findOne({ _id: req.userId }, { role: 1 });

    // console.log(userr.role)

    if (userr.role === "superadmin") {
      // console.log("user")
      const changeplotRgstry = await plotRegistoryModel.updateOne(
        { plotId: req.params.plotId },
        {
          $set: {
            registoryStatus: req.body.registoryStatus
          }
        },
        { new: true }
      );

      if (changeplotRgstry) {
        return res
          .status(200)
          .json({ message: "Registory Status updated successfully" });
      }
    } else {
      return res.status(400).json({ message: "Invalid authorization" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};

// delete all data in bulk
exports.deleteAllBulkData = async function (req, res) {
  // try {
    const customers = await customerModel.deleteMany({});

    // const operations = await operationModel.deleteMany({});

    const payements = await paymentModel.deleteMany({});

    const plots = await plotModel.deleteMany({});

    const plotStages = await plotStageModel.deleteMany({});

    const projects = await projectNameModel.deleteMany({});

    res.status(200).json({ message: "Records removed successfully" });
  // } catch (err) {
  //   res.status(400).json({ message: "Records could not be removed" });
  // }
};