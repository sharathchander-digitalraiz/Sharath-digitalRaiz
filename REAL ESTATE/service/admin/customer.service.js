const customerModel = require("../../model/customer");
const plotModel = require("../../model/plot");
const adminModel = require("../../model/adminAuth");

// add customer
class Custom {
  addCustomerdetails(customerData) {
    return new Promise(async (res, rej) => {
      // console.log(adminData)
      try {
        let newCustomer = customerModel(customerData);
        let data = await newCustomer.save();
        // console.log(data);
        res({ message: "added customer" });
      } catch (err) {
        console.log("eror", err);
        if (err.code === 11000) {
          rej({
            status: 400,
            message: "Customer already exist"
          });
          return;
        }
        rej({ error: err, status: 500, message: "Internal server Error" });
      }
    });
  }
}

module.exports = Custom;