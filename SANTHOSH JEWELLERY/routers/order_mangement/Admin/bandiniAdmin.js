const express = require("express")
const router = express.Router();
const tokenVerify = require("../../../middlewares/verifyToken");

//bandiniAdmin controllers
const bandiniAdmin = require("../../../controllers/order_management/Admin/bandiniAdmin")

//bandiniAdmin routes
router.get("/all-bandini", tokenVerify.verifyToken, bandiniAdmin.getAllBandiniAdmin);
router.get("/all-bandini-in-department", tokenVerify.verifyToken, bandiniAdmin.getEmpWithDept);
router.get("/search-bandini/:id", tokenVerify.verifyToken, bandiniAdmin.getBandiniAdmin);
router.post("/add-bandini", tokenVerify.verifyToken, bandiniAdmin.addBandini);
router.put("/edit-bandini/:id", tokenVerify.verifyToken, bandiniAdmin.updateBandiniAdmin);
router.delete("/remove-bandini/:id", tokenVerify.verifyToken, bandiniAdmin.deleteBandiniAdmin);

module.exports = router;
