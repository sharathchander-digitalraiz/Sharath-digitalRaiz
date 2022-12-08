const customerSchema = require("../../models/customers/customerSchema");

//add customer
exports.addCustomer = async function (req, res) {
  try {
    const addCust = new customerSchema({
      customer_name: req.body.customer_name,
      mobile: req.body.mobile,
      alternate_mobile: req.body.alternate_mobile,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      created_date: req.body.created_date,
      created_by: new Date().toISOString().slice(0, 10),
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: err });
      } else {
        res
          .status(400)
          .json({ success: true, message: "successfully inserted data" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//update customer
exports.updateCustomer = async function (req, res) {
  try {
    const customerData = await customerSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        customer_name: req.body.customer_name,
        mobile: req.body.mobile,
        alternate_mobile: req.body.alternate_mobile,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        modified_by: req.body.modified_by,
        modified_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (customerData) {
      res.status(400).json({
        success: true,
        message: "customer data updated successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "customer data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get customer
exports.getCustomer = async function (req, res) {
  try {
    const customerData = await customerSchema.findById({ _id: req.params.id });
    if (customerData) {
      res.status(400).json({
        success: true,
        message: "success",
        customerData
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "customer data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//getAll customer
exports.getAllCustomer = async function (req, res) {
  try {
    const customerData = await customerSchema.find();
    if (customerData) {
      res.status(400).json({
        success: true,
        message:"successfull",
        customerData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message:"customer data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete --pending
exports.deleteCustomer = async function (req, res) {
  try {
    const customerData = await customerSchema.findByIdAndDelete({ _id: req.params.id });
    if (customerData) {
      res.status(400).json({
        success: true,
        message: "customer data deleted successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "customer data not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};