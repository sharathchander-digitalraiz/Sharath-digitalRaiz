const express = require("express");
const router = express.Router();

//middlewares
const verifyToken = require("../../middlewares/verifyToken");
const imgeUpload = require("../../middlewares/multer");

//controllers
const deptController = require("../../controllers/employees/department");

//dept routes
router.get(
  "/all-departments",
  verifyToken.verifyToken,
  deptController.getAllDepartement
);
router.get(
  "/search-department/:key",
  verifyToken.verifyToken,
  deptController.getOneDepartement
);//get by key through params
router.get(
  "/search-department/:key",
  verifyToken.verifyToken,
  deptController.getOneDeptById
); //get by id
router.post(
  "/add-department",
  verifyToken.verifyToken,
  imgeUpload.uploadImage.single("avatar"),
  deptController.addDepartement
);
router.put(
  "/edit-department/:id",
  verifyToken.verifyToken,
  deptController.editDepartement
);
router.delete(
  "/remove-department/:id",
  verifyToken.verifyToken,
  deptController.deleteDepartement
);

module.exports = router;
