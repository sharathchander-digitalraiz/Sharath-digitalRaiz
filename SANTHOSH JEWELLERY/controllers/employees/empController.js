const AdminEmpModel = require("../../models/adminEmp/adminEmpSchema");
const DeptModel = require("../../models/adminEmp/departments");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//adding Employee(emp)
exports.addEmp = function (req, res) {
  try {
    AdminEmpModel.findOne({ email: req.body.email }).exec(async (err, emp) => {
      if (emp) {
        return res
          .status(400)
          .json({ success: false, message: "employee/email is already exist" });
      }
      const deptData = await DeptModel.findById({_id:req.body.department_Id},{deptName:1})
      const empAdded = new AdminEmpModel({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
        department_Id: req.body.department_Id,
        designation: deptData.deptName,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        address: req.body.address,
        avatar: req.file.path,
        created_by: req.body.created_by,
        created_log_date: new Date().toISOString().slice(0, 10),
      }).save(function (err, data) {
        if (err) {
          return res.status(400).json({ success: false, message: err });
        }
        return res
          .status(200)
          .json({ success: true, message: "successfully inserted" });
      });
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//login to admin
exports.employeeLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const empFound = await AdminEmpModel.findOne({ email: email });
    if (empFound) {
      const isMatch = await bcrypt.compare(password, empFound.password);
      if (isMatch) {
        const token = jwt.sign(
          { _id: empFound._id },
          "process.env.SJ_VERIFY_TOKEN",
          { expiresIn: "24h" }
        );
        if (token) {
          const empDetails = {
            id: empFound._id,
            first_name: empFound.first_name,
            last_name: empFound.last_name,
            email: empFound.email,
            designation: empFound.designation,
            avatar: empFound.avatar,
          };
          return res
            .status(200)
            .json({ success: true, empDetails, token: token });
        } else {
          res.status(400).send({
            success: false,
            message: "error in token generation or sending token",
          });
        }
      } else {
        res
          .status(400)
          .send({ success: false, message: "you entered wrong password" });
      }
    } else {
      res
        .status(400)
        .send({ success: false, message: "you entered wrong username" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get emp profile
exports.getEmployee = async (req, res) => {
  try {
    const empFound = await AdminEmpModel.findById({ _id: req.admin });
    if (empFound) {
      res.status(200).json({ success: true, message: empFound });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//update emp profile
exports.updateEmployee = async function (req, res) {
  try {
    const deptData = await DeptModel.findById({_id:req.body.department_Id},{deptName:1})
    let empFound = await AdminEmpModel.findOneAndUpdate(
      { _id: req.admin },
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        department_Id: req.body.department_Id,
        designation: deptData.deptName,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        address: req.body.address,
        avatar: req.file.path,
        modified_by: req.body.modified_by,
        modified_log_date: new Date().toISOString().slice(0, 10),
      }
    );
    if (empFound) {
      res
        .status(200)
        .json({ success: true, message: "profile updated successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "unable to update profile" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//get all emp profile
exports.getAllEmployees = async (req, res) => {
  try {
    const empsFound = await AdminEmpModel.find({});
    if (empsFound) {
      res.status(200).json({ success: true, message:"success", empsFound });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//delete emp profile
exports.deleteEmp = async (req, res) => {
  try {
    const empDeleted = await Schema.findByIdAndDelete({ _id: req.params.id });
    if (empDeleted) {
      res.status(200).json({ success: true, message:"successfully deleted" });
    } else {
      res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};



// router.post('/users/logout', authenticate, async (req, res) => {
//   try {
//     const empFound = await AdminEmpModel.findById({ _id: req.admin });
//     empFound.tokens = empFound.tokens.filter((token) =>{
//        return token.token !== req.token 
//       })
//       jwt.invalidate(token);
//       delete req.session.token;
//       await req.user.save()
//       res.send()
//   } catch (error) {
//       res.status(500).send()
//   }
// });

// // //logout profile
// exports.logoutEmploye = async (req, res) => {
//   try {
//     const empFound = await AdminEmpModel.findById({ _id: req.admin });
//     if (empFound) {
//       res.status(200).json({ success: true, message: empFound });
//     } else {
//       res.status(400).json({ success: false, message: "Bad request" });
//     }
//   } catch (err) {
//     res.status(400).json({ success: false, message: err });
//   }
// };