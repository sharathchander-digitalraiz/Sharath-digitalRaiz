const express = require("express");
const router = express.Router();

//middlewares
const verifyToken = require("../../middlewares/verifyToken");
const multer = require("../../middlewares/multer")

//controllers
const orderController = require("../../controllers/order_management/orderManagement");

//API calls
router.post(
  "/add-order",
  verifyToken.verifyToken,
  multer.uploadImage.array("images",5),
  orderController.addOrder
);
router.put(
  "/edit-order-details/:id",
  verifyToken.verifyToken,
  multer.uploadImage.array("images",5),
  orderController.updateOrder
);
router.get(
  "/find-order/:id",
  verifyToken.verifyToken,
  orderController.getOrder
);
router.get(
  "/list-orders",
  verifyToken.verifyToken,
  orderController.getAllOrder
);
router.delete(
    "/delete-order/:id",
    verifyToken.verifyToken,
    orderController.deleteOrder
  );


module.exports = router;
