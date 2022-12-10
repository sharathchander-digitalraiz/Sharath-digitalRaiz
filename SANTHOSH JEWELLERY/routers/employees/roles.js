const express = require("express")
const router = express.Router();
const token = require("../../middlewares/verifyToken");

//roles controllers
const roles = require("../../controllers/employees/roles")
;
//roleAdmin routes
router.get("/all-role", token.verifyToken, roles.getAllRoles);
router.get("/search-role/:id", token.verifyToken, roles.getRoleById);
router.post("/add-role", token.verifyToken, roles.addRole);
router.put("/edit-role/:id", token.verifyToken, roles.editRole);
router.delete("/remove-role/:id", token.verifyToken, roles.deleteRoles);

module.exports = router;
