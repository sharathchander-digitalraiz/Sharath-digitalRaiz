const Custom = require("../../service/admin/customer.service");
const multer = require("multer");
const customerModel = require("../../model/customer");
const adminModel = require("../../model/adminAuth");
const plotModel = require("../../model/plot");

const custom = new Custom();

// add customer
exports.addCustomer = async function (req, res) {
  try {
    const buyerObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      presentAddress: req.body.presentAddress,
      permanentAddress: req.body.permanentAddress,
      plotId: req.body.plotId,
      employeeId: req.body.employeeId,
      remark: req.body.remark
    };

    await custom.addCustomerdetails(buyerObj);

    res.status(200).json({ message: "Customer added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

// get all customers
exports.getAllCustomers = async function (req, res) {
  try {
    const customerResult = await customerModel.find().sort({ createdAt: -1 });

    res.status(200).json({ message: "Success", customerResult });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// update customer details
exports.updateCustomerDetails = async function (req, res) {
  //try {
    // always use plotId as id in this api
    const userrr = await adminModel.findOne(
      { _id: req.userId },
      { role: 1, firstName: 1, lastName: 1 }
    );
console.log(userrr.role);
    if (userrr.role == "superadmin" || userrr.role == "admin") {

      const plott = await plotModel.findOne(
        { _id: req.body._id },
        { _id: 1, customerId: 1 }
      );

      const changeCustomerdata = await customerModel.updateOne(
        { plotId: plott._id, status: true },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            contactNumber: req.body.contactNumber,
            email: req.body.email,
            presentAddress: req.body.presentAddress,
            permanentAddress: req.body.permanentAddress
          }
        },
        { new: true }
      );

      const changePlotdata = await plotModel.updateOne(
        { _id: plott._id, status: true },
        {
          $set: {
            customerName: `${req.body.firstName} ${req.body.lastName}`,
            customerPhone: req.body.contactNumber,
            employeeId: req.userId,
            employeeName: `${userrr.firstName} ${userrr.lastName}`,
            logDateModified: new Date().toISOString().slice(0, 10)
          }
        },
        {
          new: true
        }
      );

      console.log(changeCustomerdata);

      if (changeCustomerdata) {
        return res
          .status(200)
          .json({ message: "Customer deatils updated successfully" });
      }
    } else {
      res.status(400).json({ message: "Invalid authorization" });
    }
  // } catch (err) {
  //   res.status(400).json({ message: "Something went wrong..!" });
  // }
};
