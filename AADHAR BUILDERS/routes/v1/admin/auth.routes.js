const authRoute = require("express").Router();
const ProfileRoute = require("express").Router();

// importing the required validations
// const {
//   validate_forgotpassword,
//   validate_updatepassword,
//   isRequestvalidateforgotpass
// } = require("../../../validators/forgot_password_validator");

//  Importing the auth controller
const auth = require("../../../controller/admin/auth.controller");

// defining the routes
/************ Profile apis ************/
ProfileRoute.post("/adminprofile", auth.adminprofile);

ProfileRoute.post("/getallemployees", auth.getAllEmployees);

ProfileRoute.patch("/editemployestatus/:id", auth.updateEmployee);

ProfileRoute.patch("/updatepassword", auth.update_password);

ProfileRoute.post("/removeemploye/:id", auth.removeEmployeFromList);



ProfileRoute.put(
  "/updateimage",
  auth.upload_userImages.single("profileImg"),
  auth.uploadProfileImg
);

ProfileRoute.put("/updateprofile", auth.adminProfileUpdate);

/************ register and signin apis ****************/
authRoute.post("/register", auth.register);
const registerSchema = {
  "/v1/admin/auth/register": {
    parameters: [
      {
        in: "body",
        name: "body",
        type: "object",
        schema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "Admin digital"
            },
            email: {
              type: "string",
              example: "admin@digitalraiz.com"
            },
            password: {
              type: "string",
              example: "admindigit123"
            },
            phone: {
              type: "number",
              example: "9875712568"
            }
          }
        }
      }
    ],
    post: {
      tags: ["Admin | Auth"],
      description: "This is admin registration",
      responses: {
        200: {
          description: "Success"
        },
        409: {
          description: "email or mobile already exist"
        }
      }
    }
  }
};

authRoute.post("/login", auth.login);

const loginSchema = {
  "/v1/admin/auth/login": {
    post: {
      tags: ["Admin | Auth"],
      description: "This is admin login",
      responses: {
        200: {
          description: "Success"
        },
        422: {
          description: ""
        },
        403: {
          description: "password or email is wrong"
        }
      }
    }
  }
};

/****************** Employee login History apis *************/
ProfileRoute.post("/employee-loginhistory", auth.getAllEmployeesLoginHistory);

ProfileRoute.delete("/removeloghistory/:id", auth.removeLoghistory)

/************** Admin logout ************************/
authRoute.post("/updatelogout", auth.updateLogout);

/*************************** Profile routes ***************/
// ProfileRoute.post(
//   "/change_password",
//   validate_forgotpassword,
//   isRequestvalidateforgotpass,
//   auth.change_pasword
// );

// ProfileRoute.get("/adminprofile", auth.adminprofile);
// ProfileRoute.put(
// "/updateimage",
// auth.upload_profile.array("profileimage", 1),
// auth.uploadProfileImg
// );

// ProfileRoute.put("/updatepassword", auth.update_password);

const authSchema = { ...registerSchema, ...loginSchema };

module.exports = {
  authRoute,
  authSchema,
  ProfileRoute
};
