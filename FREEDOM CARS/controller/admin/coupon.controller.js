const Coupon = require("../../model/coupon_model");

exports.new_coupon = function (req, res) {
  // try {
  let logDate = new Date().toISOString();

  const coupons = new Coupon({
    title: req.body.title,
    coupon_code: req.body.coupon_code,
    coupon_code_type: req.body.coupon_code_type,
    amount: req.body.amount,
    description: req.body.description,
    from_date: req.body.from_date,
    to_date: req.body.to_date,
    logDateCreated: logDate,
    logDateModified: logDate,
    couponUsage: req.body.couponUsage
  });

  coupons.save(function (err, data) {
    if (data) {
      res
        .status(200)
        .send({ success: true, message: "Coupon added successfully" });
    } else {
      res.status(400).send({ success: false, message: err });
    }
  });
  // } catch (err) {
  //   res.status(400).send({ success: false, message: err });
  // }
};

exports.edit_coupon = async function (req, res) {
  try {
    let logDate = new Date().toISOString();

    const data = await Coupon.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        coupon_code: req.body.coupon_code,
        coupon_code_type: req.body.coupon_code_type,
        amount: req.body.amount,
        description: req.body.description,
        from_date: req.body.from_date,
        to_date: req.body.to_date,
        couponUsage: req.body.couponUsage,
        logDateModified: logDate,
        status: req.body.status
      }
    );
    if (data) {
      res.status(200).send({ success: true, message: "successfully updated" });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Not updated.Please try again" });
    }
  } catch (err) {
    res
      .status(400)
      .send({ success: false, message: "not updated some thing went wrong" });
  }
};

exports.delete_coupon = async function (req, res) {
  try {
    const data = await Coupon.findOneAndDelete({ _id: req.params.id });
    if (data) {
      res.status(200).send({ success: true, message: "successfully deleted," });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Not deleted.Please try again" });
    }
  } catch (err) {
    res.status(400).send({ success: false, message: "Some thing went wrong" });
  }
};

exports.getAllCoupons = async function (req, res) {
  try {
    let searchCodtion = new RegExp(req.query.searchQuery, "i");

    const couponsFound = await Coupon.find({
      $or: [
        { title: searchCodtion },
        { coupon_code: searchCodtion },
        { from_date: searchCodtion },
        { to_date: searchCodtion }
      ]
    }).sort({
      logDateCreated: -1
    });

    res.status(200).send({
      success: true,
      message: "successfull",
      couponsFound
    });
  } catch (err) {
    res
      .status(400)
      .send({ success: false, message: "not found some thing went wrong" });
  }
};

// get all active coupons
exports.getAllActiveCoupons = async function (req, res) {
  try {
    const activeCoupons = await Coupon.find({ status: true }).sort({
      logDateCreated: -1
    });

    res.status(200).json({ message: "Success", activeCoupons });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// get coupon by coupon code
exports.getCouponByCode = async function (req, res) {
  try {
    const coupon = await Coupon.findOne({ coupon_code: req.body.coupon_code });

    res.status(200).json({ message: "Success", coupon });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};
