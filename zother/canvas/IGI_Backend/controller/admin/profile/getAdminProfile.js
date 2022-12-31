// importing the required model
const userModel = require("../../../model/userAuth");

// defining the function
exports.getUserProfile = async function (req, res) {
  try {
    const ProfileResult = await userModel.findById({ _id: req.body._id });

    res.status(200).json({ message: "Success", ProfileResult });
  } catch (err) {
    // throw err
    res.status(400).json({ message: "Bad request" });
  }
};

// get all users
exports.getAllAggUser = async function (req, res) {
  try {
    let userArr = [];
    const usersResult = await userModel
      .aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "departmentId",
            foreignField: "_id",
            as: "userDeptJoin",
          },
        },
        { $unwind: "$userDeptJoin" },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            contactNumber: 1,
            email: 1,
            role: 1,
            departmentId: 1,
            status: 1,
            departmentName: "$userDeptJoin.title",
          },
        },
      ])
      .exec();

    usersResult.map((item) => {
      if (item.role == "admin") {
        userArr.push(item);
      }
    });

    res.status(200).json({ message: "Success", userArr });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

/**************
 const articleResult = await articleModel.aggregate([
      {
        $lookup: {
          from: "statecategoryschemas",
          localField: "stateId",
          foreignField: "_id",
          as: "stateArtJoin",
        },
      },
      { $unwind: "$stateArtJoin" },
      {
        $lookup: {
          from: "districtcategoryschemas",
          localField: "districtId",
          foreignField: "_id",
          as: "distArtJoin",
        },
      },
      { $unwind: "$distArtJoin" },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          stateName: "$stateArtJoin.stateName",
          districtName: "$distArtJoin.districtName",
        },
      },
    ]);
 */
