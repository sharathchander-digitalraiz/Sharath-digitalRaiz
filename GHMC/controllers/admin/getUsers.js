const users = require("../../model/users");
const department = require("../../model/department");
const useraccesses = require("../../model/useraccess");
const mongo = require("mongodb");
const pwdhash = require("node-php-password");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

exports.getUsers = async (req, res) => {
  const user = await users
    .find(
      {},
      {
        _id: 1,
        first_name: 1,
        last_name: 1,
        department_name: 1,
        email: 1,
        mobile_number: 1,
        username: 1,
        user_access_name: 1,
        log_date_created: 1
      }
    )
    .exec();
  responseObject = {
    success: true,
    login: true,
    message: "Sucessfully completed",
    data: user
  };
  res.status(200).json(responseObject);
};
exports.addUser = async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    department_id,
    category_id,
    password,
    email,
    mobile_number,
    status,
    tenent_id
  } = req.body;
  const drow = await department
    .findOne({ _id: department_id }, { _id: 1, name: 1 })
    .exec();
  const useraccessrow = await useraccesses
    .find({ _id: category_id }, { _id: 1, name: 1 })
    .exec();
  const urows = await users
    .find({ username: username }, { _id: 1 })
    .countDocuments();
  console.log(drow);
  if (urows == 0) {
    const user = new users({
      first_name: first_name,
      last_name: last_name,
      username: username,
      department_id: department_id,
      department_name: drow.name,
      tenent_id: tenent_id,
      password: pwdhash.hash(password),
      email: email,
      mobile_number: mobile_number,
      status: status,
      created_by: req.user.user_id,
      user_access_id: category_id,
      user_access_name: useraccessrow[0].name
    });
    user.save((error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        responseObject = {
          success: true,
          login: true,
          message: "Saved successfully"
        };
        res.status(200).json(responseObject);
      }
    });
  } else {
    responseObject = {
      success: false,
      login: true,
      message: "Username already existed"
    };
    res.status(200).json(responseObject);
  }
};

exports.singleUser = async (req, res) => {
  const { id } = req.body;
  const alldata = await users.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "useraccesses", // other table name
        localField: "user_access_id", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "acc_info" // alias for userinfo table
      }
    }, // define which fields are you want to fetch
    { $unwind: "$acc_info" },
    {
      $project: {
        _id: 1,
        first_name: 1,
        last_name: 1,
        department_name: 1,
        email: 1,
        mobile_number: 1,
        username: 1,
        department_id: 1,
        status: 1,
        acee_name: "$acc_info.name",
        acee_id: "$acc_info._id",
        log_date_created: 1
      }
    }
  ]);
  //const user = await users.find({add_type:'Super admin'},{ _id: 1,first_name: 1, last_name: 1,department_name:1,email:1,mobile_number:1,username:1,user_access_name:1,log_date_created:1 } ).exec();
  responseObject = {
    success: true,
    login: true,
    message: "Sucessfully completed",
    data: alldata
  };
  res.status(200).json(responseObject);
};

exports.updateUser = async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    department_id,
    category_id,
    email,
    mobile_number,
    user_access_id,
    status
  } = req.body;
  const useraccesses_row = await useraccesses
    .findOne({ _id: user_access_id }, { _id: 1, name: 1 })
    .exec();
  // console.log(useraccesses_row);
  // console.log(category_id);
  // console.log("category_id");
  // console.log(user_access_id);
  const data = await users.updateOne(
    { _id: id },
    {
      first_name: first_name,
      last_name: last_name,
      department_id: department_id,
      category_id: user_access_id,
      user_access_name: useraccesses_row.name,
      email: email,
      mobile_number: mobile_number,
      status: status,
      user_access_id: user_access_id,
      modified_by: req.userId
    },
    { new: true }
  );

  if (data) {
    responseObject = {
      status: true,
      login: true,
      message: "Updated Successfully"
    };
    res.status(200).json(responseObject);
  }
};

// (err, data) => {
//   if (err) {
//     responseObject = {
//       status: false,
//       login: true,
//       message: "Something went wrong please try again"
//     };
//     res.status(400).json(responseObject);
//   } else if (data == null) {
//     responseObject = {
//       status: false,
//       login: true,
//       message: "Sorry unable to update user"
//     };
//     res.status(400).json(responseObject);
//   } else if (data) {
//     responseObject = {
//       status: true,
//       login: true,
//       message: "Updated Successfully"
//     };
//     res.status(200).json(responseObject);
//   }
// }

exports.getSFAUsers = async (req, res) => {
  const user = await users
    .find(
      { department_name: "SFA" },
      {
        _id: 1,
        first_name: 1,
        last_name: 1,
        department_name: 1,
        email: 1,
        mobile_number: 1,
        username: 1,
        user_access_name: 1,
        log_date_created: 1
      }
    )
    .exec();
  responseObject = {
    success: true,
    login: true,
    message: "Sucessfully completed",
    data: user
  };
  res.status(200).json(responseObject);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  const data = await users.findOne({ _id: id }).countDocuments();
  if (data != "0") {
    users.findByIdAndRemove({ _id: id }, function (err, docs) {
      if (err) {
        responseObject = {
          success: false,
          login: true,
          message: "Something went wrong please try again"
        };
        res.status(400).json(responseObject);
      } else {
        responseObject = {
          success: true,
          login: true,
          message: "Deleted Successfully"
        };
        res.status(200).json(responseObject);
      }
    });
  } else {
    responseObject = { success: true, login: true, message: "Invalid Id" };
    return res.status(200).json(responseObject);
  }
};
