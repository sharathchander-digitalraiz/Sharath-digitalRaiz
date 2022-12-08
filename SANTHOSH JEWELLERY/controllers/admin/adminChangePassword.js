const bcrypt = require("bcryptjs");
const Schema = require("../../models/adminEmp/adminEmpSchema");

//change password
exports.changePassword = async (req, res) => {
  try {
    const password = req.body.password
    const adminData = await Schema.findOne({_id:req.admin})
    const passwordMatched = await bcrypt.compare(password, adminData.password);
    if(passwordMatched){
      const newpassword = req.body.newpassword;
      const confirmpassword = req.body.confirmpassword;
      if (newpassword === confirmpassword) {
        const adminFound = await Schema.findOne({ _id: req.admin });
        if (adminFound) {
          const newPassword = bcrypt.hashSync(confirmpassword, 10);
          await Schema.findOneAndUpdate(
            { _id: req.admin },
            { $set: { password: newPassword } }
          );
          res
            .status(200)
            .json({
              success: true,
              messsage: "Your password has been successfully updated." ,
            });
        }
      } else { 
        res 
          .status(400)
          .json({
            success: false,
            messsage: "The new-password does not correspond to the confirm-password. ",
          });
      }
    }else {
      res 
        .status(400)
        .json({
          success: false,
          messsage: "Password is wrong.",
        });
    }
    
  } catch (err) {
    res.status(400).json({ success: false, messsage: err });
  }
};
