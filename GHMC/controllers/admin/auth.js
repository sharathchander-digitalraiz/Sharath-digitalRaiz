const users = require("../../model/users");
const config = require("../../config/configuration");
let jwt = require("jsonwebtoken");
const pwdhash = require("node-php-password");
const user_geoaccess = require("../../model/tenent_geo_tagging_access");
const user_access = require("../../model/useraccess");
const tenent = require("../../model/tenent");
exports.login = async (req, res) => {
  const { username, password } = req.body;

  users.findOne({ username: username }).then(async (user_data) => {
    if (user_data) {
      if (pwdhash.verify(password, user_data.password)) {
        let token = jwt.sign(
          { username: username, user_id: user_data._id },
          config.secret,
          { expiresIn: "24h" }
        );
        let data = {};
        data.user_id = user_data._id;
        data.first_name = user_data.first_name;
        data.last_name = user_data.last_name;
        data.email = user_data.email;
        data.mobile = user_data.mobile_number;
        data.deparment_id = user_data.deparment_id;
        data.department_name = user_data.department_name;
        data.token = token;
        let user_geoaccess_rows = 0;
        let user_geoaccess_data = [];
        let user_acc_data = [];
        if (user_data.department_name == "Admin") {
          user_geoaccess_rows = await user_geoaccess
            .findOne({ _id: user_data.user_geoaccess_id })
            .countDocuments();
          user_geoaccess_data = await user_geoaccess
            .findOne({ _id: user_data.user_geoaccess_id })
            .exec();
          user_acc_data = user_geoaccess_data.geo_tag_access;
          data.tenent_id = user_data.tenent_id;
          tenentData = await tenent
            .findOne({ _id: user_data.tenent_id })
            .exec();
          data.tenent_logo = tenentData.image;
        } else if (user_data.department_name != "Super Admin") {
          user_geoaccess_rows = await user_access
            .findOne({ _id: user_data.user_access_id })
            .countDocuments();
          user_geoaccess_data = await user_access
            .findOne({ _id: user_data.user_access_id })
            .exec();
          user_acc_data = user_geoaccess_data.admin_access;
          data.tenent_id = user_data.tenent_id;
          tenentData = await tenent
            .findOne({ _id: user_data.tenent_id })
            .exec();
          data.tenent_logo = tenentData.image;
        }
        if (user_geoaccess_rows > 0) {
          data.access = user_acc_data;

          //  data.tenent_id = "";
        } else {
          data.access = [];
          data.tenent_id = "";
          data.tenent_logo = "";
        }
        data.profile = data.profile;
        responseObject = {
          success: true,
          login: true,
          message: "Authentication successful!",
          data: data
        };
        res.status(200).json(responseObject);
      } else {
        responseObject = {
          success: false,
          login: false,
          message: "Incorrect password",
          data: []
        };
        res.status(400).json(responseObject);
      }
    } else {
      responseObject = {
        success: false,
        login: false,
        message: "Incorrect Username or password",
        data: []
      };
      res.status(400).json(responseObject);
    }
  });
};
