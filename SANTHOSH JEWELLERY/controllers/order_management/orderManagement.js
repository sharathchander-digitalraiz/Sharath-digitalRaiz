const Order = require("../../models/order_management/order");

//add order
exports.addOrder = async function (req, res) {
  try {
    const imagesArr = [];
    let orderImages = req.files;
    orderImages.map((item)=>{
        imagesArr.push(item.path)
    })
    const orderAdded = new Order({
      customer_name: req.body.customer_name,
      date: req.body.date,
      bill_no: req.body.bill_no,
      order_no: req.body.order_no,
      customer_details: req.body.customer_details,
      mobile: req.body.mobile,
      item_name: req.body.item_name,
      item_detail: req.body.item_detail,
      item_purity: req.body.item_purity,
      image: imagesArr,
      gold_weight: req.body.gold_weight,
      stone_range: req.body.stone_range,
      item_size: req.body.item_size,
      special_remarks: req.body.special_remarks,
    }).save(function (err, data) {
      if (err) {
        res.status(200).json({ success: false, message: err });
      } else {
        res
          .status(400)
          .json({ success: true, message: "successfully placed order" });
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//update order
exports.updateOrder = async function (req, res) {
  try {
    const imagesArr = [];
    let orderImages = req.files;
    orderImages.map((item)=>{
        imagesArr.push(item.path)
    })
    const orderUpdated = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      {
        customer_name: req.body.customer_name,
        date: req.body.date,
        bill_no: req.body.bill_no,
        order_no: req.body.order_no,
        customer_details: req.body.customer_details,
        mobile: req.body.mobile,
        item_name: req.body.item_name,
        item_detail: req.body.item_detail,
        item_purity: req.body.item_purity,
        image: imagesArr,
        gold_weight: req.body.gold_weight,
        stone_range: req.body.stone_range,
        item_size: req.body.item_size,
        special_remarks: req.body.special_remarks,
      }
    );
    if (orderUpdated) {
      res.status(400).json({
        success: true,
        message: "order updated successfully",
      });
    } else {
      res.status(400).json({ success: false, message: "order not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get order
exports.getOrder = async function (req, res) {
  try {
    const orderData = await Order.findById({ _id: req.params.id });
    if (orderData) {
      res.status(400).json({
        success: true,
        message: "success",
        orderData,
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

//getAll order
exports.getAllOrder = async function (req, res) {
  try {
    const ordersData = await Order.find();
    if (ordersData) {
      res.status(400).json({
        success: true,
        message: "successfull",
        ordersData,
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

//delete order
exports.deleteOrder = async function (req, res) {
  try {
    const orderDeleted = await Order.findByIdAndDelete({ _id: req.params.id });
    if (orderDeleted) {
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
