const express = require("express");
const router = express.Router();
const coupons = require("../../../controller/admin/coupon.controller");
const { upload_userImages } = require("../../../middleware/mediaupload");

router.post("/new", upload_userImages.none(), coupons.new_coupon);
router.put("/edit/:id", upload_userImages.none(), coupons.edit_coupon);
router.delete("/delete/:id", upload_userImages.none(), coupons.delete_coupon);
router.post("/couponbycode", upload_userImages.none(), coupons.getCouponByCode);
router.post("/all", upload_userImages.none(), coupons.getAllCoupons);
router.get("/allactivecoupons", upload_userImages.none(), coupons.getAllCoupons);

module.exports = router;
