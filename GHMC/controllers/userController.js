const users = require('../models/index').users;
const userDetails = require('../models/index').userDetails;
const db = require('../models/index').sequelize;
const { body } = require('express-validator');
var sequelize = require('sequelize');
const models = require('../models/index');
const pwdhash = require('node-php-password')
let jwt = require('jsonwebtoken');
const config = require('../config/configuration');
const mail = require('../lib/send-mail');
const sms = require('../lib/send-sms');
const task = require('../models/index').task;
var quotes = require('../models/index').quote;
var uploadService = require('../services/fileUploadService');
var common = require('../services/Common');
const subcategires = require('../models/index').subcategires;
const express = require('express');
/* const app = express();
const http = require('http');
var server = http.createServer(app); */
var io = require('socket.io');
//var io = require("socket.io")(server);
 require('../node_modules/socket.io/lib/socket.js'); 

exports.userLogin = function (req, res) 
{
  return users.findOne({ where: {email: req.body.username}}).then((user_data) => 
  {
    let username = req.body.username;
	/*  console.log(user_data.dataValues.is_active);
	console.log('helllo'); */ 
    if(user_data && pwdhash.verify(req.body.password, user_data['password']) && user_data.dataValues.is_active=='1') 
	{
      let token = jwt.sign({ username: username, user_id: user_data.user_id }, config.secret, { expiresIn: '24h' });
      let data = {};
      data.email = user_data.email;
      data.phoneNumber = user_data.mobile;
      data.fullName = user_data.full_name;
      data.userId = user_data.user_id;
      data.referer_code = user_data.referer_code;
      data.wallet = user_data.wallet;

      responseObject = 
	  {
        success: true,
        message: 'Authentication successful!',
        token: token,
		'otp':false,
        data: data
      }
      res.status(200).send(responseObject);
    } 
	else
	{
		if(user_data)
		{
		  	if(user_data.dataValues.is_active=='0' && pwdhash.verify(req.body.password, user_data['password']))
			{
			 var randomPin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
		     var mobileTokenAttributes = {};
			 mobileTokenAttributes.mobileToken = randomPin;
			 mobileTokenAttributes.tokenDateTime = new Date();
			  //mobileTokenAttributes.mobile = mobileNumber;
			users.update(mobileTokenAttributes, { where: { 'user_id': user_data.dataValues.user_id } }).then(users => 
			{
			  return users;
			})
			
			  let template = "Dingu: Your one-time verification code is: " + randomPin + " Msg and data rates may apply";
			  var smsOptions = 
			  {
				mobileNumber: user_data.dataValues.mobile,
				textMessage: template
			  }
			  sms.sendSms(smsOptions).then(response => 
			  {
				res.json({
				  success: true,
				  message: 'OTP has Sent Successfully'
				});
			  });
			  
			  let data = {};
			  data.phoneNumber = user_data.dataValues.mobile;
			  data.userId = user_data.user_id;
			  responseObject = {'success': true,'otp':true,'message':'Otp has Sent Successfully','data': data};
			 res.status(200).send(responseObject);
			}
			else if(user_data['is_active']=='2')
			{
				 responseObject = { 'success': false, 'otp':false,'error': 'Your account blocked.Contact support', 'data': null }
				 res.status(403).send(responseObject);
			}
			else
			{
				 let mtemplate = "<p>Security email - Failed password attempt alerts<br>**Alert**<br>Please try again....The email and Password you entered did not match. please check and try again.<p>";
				 
				 let template = "Security - Failed password attempt alerts **Alert** Please try again....The email and Password you entered did not match. please check and try again.";
				  var smsOptions = 
				  {
					mobileNumber: user_data.dataValues.mobile,
					textMessage: template
				  }
				  sms.sendSms(smsOptions).then(response => 
				  {
					res.json({
					  success: true,
					  message: 'OTP has Sent Successfully'
					});
				  });
				 var mailOptions = {
				  from: "no-reply@dingudoes.com", // sender address
				  to: user_data.dataValues.email, // list of receivers
				  subject: "Login", // Subject line
				  html: mtemplate // html body
				}
				mail.sendMail(mailOptions).then(response => 
				{responseObject = {'success': true}});
			  
				
				
				 responseObject = { 'success': false,'otp':false,'error': 'Incorrect  password', 'data': null }
				 res.status(403).send(responseObject);
			}
		}
		else
		{
			responseObject = {'success': false, 'otp':false,'error': 'Incorrect Username or password', 'data': null }
			res.status(403).send(responseObject);
		}
	  
	  
      
    }

  })

}

exports.changePassword = function (req, res) 
{

  let userId = req.decoded.user_id;
  return users.findByPk(userId).then((user_data) => 
  {

    if (user_data && pwdhash.verify(req.body.password, user_data['password'])) 
	{

      return models.sequelize.transaction(t => {
        return users.update({ 'password': pwdhash.hash(req.body.newpassword) }, { where: { 'user_id': userId } }, { transaction: t }).then(users => {
          return users;
        })
      }).then(result => {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        responseObject = {
          success: true,
          message: 'Password Updated Successfully',
          data: result
        }
        res.status(200).json(responseObject);
      }).catch(err => {
        console.log(err);
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        responseObject = { 'success': false, 'error': err.errors }
        res.status(500).json(responseObject);
      });

    } else {
      responseObject = { 'success': false, 'message': "Incorrect Password" }
      res.status(500).json(responseObject);
    }
  });

}

exports.getUserDetails = function (req, res) 
{
  let userId = req.params.user_id;
  return users.findByPk(userId, { include: [{ model: userDetails }] }).then(response => 
  {
    var profileScore = 0;
    if (response.beneficaryId != null && response.beneficaryId != '')
	{
      profileScore++;
    }
    if (response.userDetail.aadharNumber != null && response.userDetail.aadharNumber != '') 
	{
      profileScore++;
    }
    if (response.userDetail.license != null && response.userDetail.license != '') {
      profileScore++;
    }
    if (response.userDetail.facebookId != null && response.userDetail.facebookId != '') {
      profileScore++;
    }
    if (response.mobile != null && response.mobile != '') 
	{
      profileScore++;
    }


    var responseObject = 
	{
      success: true,
      data: response,
      profileScore: profileScore
    }

    res.status(200).send(responseObject);
  })
}

exports.gmailLogin = function (req, res) {

}

exports.facebookLogin = function (req, res) 
{

}

exports.updateFcmToken = function (req, res) 
{

  return models.sequelize.transaction(t => 
  {
    let user_id = req.decoded.user_id;
    let fcm_token = req.body.fcm_token;
    var userObject = {
      'fcmToken': fcm_token,
      'updated_by': user_id,
      'updatedAt': new Date()
    }
	console.log(userObject);
    return users.update(userObject, { where: { 'user_id': user_id } }, { transaction: t }).then(users => {
      return users;
    })
  }).then(result => {
    responseObject = {
      success: true,
      message: 'Fcm token Updated Successfully',
      data: result
    }
    res.status(200).json(responseObject);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });

}


exports.delete_pics = function (req, res) 
{
  return models.sequelize.transaction(t => 
  {
    let user_id = req.decoded.user_id;
   if(req.body.type=='profile picture')
   {
	     var userObject = 
		 {
		  'profileImage': "uploads/default.jpg",
		  'updated_by': user_id,
		  'updatedAt': new Date()
         }
   }
   else if(req.body.type=='banner')
   {
	     var userObject = 
		 {
		  'BannerImage': "uploads/images.jpg",
		  'updated_by': user_id,
		  'updatedAt': new Date()
       }
   }

	console.log(userObject);
    return users.update(userObject, { where: { 'user_id': user_id } }, { transaction: t }).then(users => {
      return users;
    })
  }).then(result => 
  {
    responseObject = 
	{
      success: true,
      message: req.body.type+ ' Deleted Successfully',
      data: result
    }
    res.status(200).json(responseObject);
  }).catch(err => 
  {
    console.log(err);
    res.status(500).json(err);
  });

}

exports.createUser = function (req, res)
{
	console.log(req.body);
  return users.findOne({where:{mobile: req.body.mobile} }).then((user_data) => 
  {
    if(user_data) 
	{
		responseObject = 
		{
			  success: false,
			  message: 'Mobile no already existed'
		}
		console.log(responseObject);
		console.log("hari");
		return res.status(500).json(responseObject);
	}
	else
	{
	  var post_task = req.body.post_task;
	  var complete_task = req.body.complete_task;
	  var referal_code = req.body.referal_code;

	  if(common.empty(post_task)){
		post_task = 0;
	  }
	  if(common.empty(complete_task))
	  {
		complete_task = 0;
	  }

	  return models.sequelize.transaction(t =>
	  {
		var randomPin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
		var userObject = 
		{
		  'email': req.body.email,
		  'full_name': req.body.full_name,
		  'last_name': req.body.last_name,
		  'mobile': req.body.mobile,
		  'password': pwdhash.hash(req.body.password),
		  'address': req.body.address,
		  'post_task': post_task,
		  'complete_task': complete_task,
		  'referal_code': referal_code,
		  'user_type': 2,
		  'uuid': "SELECT uuid() as uuid",
		  'referer_code':Math.random().toString(36).substring(7).toUpperCase(),
		  'mobileToken' : randomPin,
		  'terms' : req.body.terms,
		  'tokenDateTime': new Date(),
		  'type_reg': req.body.provider
		}
		return users.create(userObject, {transaction:t}).then(user=> 
		{ 
				var records =[1,2,3];
			var i=1;
			 records.forEach(function(item) 
			 {
			    var sql = "INSERT INTO notification_settings (notification_type, user_id,isEmail,isSMS,isPush) VALUES('"+i+"','"+user.user_id+"','1','1','1')";
				var query = db.query(sql, function(err, result) 
				{
					console.log(result);
				});
				i++;
			 });
			
	      let template = "Dingu: Your one-time verification code is: " + randomPin + " Msg and data rates may apply";
		/*   var smsOptions = 
		  {
			mobileNumber: req.body.mobile,
			textMessage: template
		  }
		  sms.sendSms(smsOptions).then(response => 
		  {
			res.json({
			  success: true,
			  message: 'OTP has Sent Successfully'
			});
		  });  */
		  
	 var mailOptions = 
	 {
	  from: "no-reply@dingudoes.com", // sender address
	  to: req.body.email, // list of receivers
	  subject: "Otp-Dingu does", // Subject line
	  html: template // html body
	}
	mail.sendMail(mailOptions).then(response => 
	{responseObject = {'success': true}});
      
	  
	  let userDetailsObject = 
	  {
        'userId': user.user_id,
        'created_by': 1,
        'createdAt': new Date(),
        'updated_by': 1,
        'updatedAt': new Date(),
		'dateOfBirth': req.body.date_of_birth
      }
      return userDetails.create(userDetailsObject, { transaction: t }).then(userDetails => 
	  {
        return userDetails;
      });
    });
  }).then(result => {
    // Transaction has been committed
    // result is whatever the result of the promise chain returned to the transaction callback
    responseObject = {
      success: true,
      message: 'user Created Successfully',
      data: result
    }
    res.status(200).json(responseObject);
  }).catch(err => {
	  
	  
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
    responseObject = { 'success': false, 'error': err.errors }
	console.log(err);
    res.status(500).json(responseObject);
     });
	}
 }).catch(err => 
 {
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
    responseObject = { 'success': false, 'error': err.errors }
    res.status(500).json(responseObject);
 });
}


exports.createUserDetails = function (req, res) 
{
  return models.sequelize.transaction(t => 
  {
    var userDetailsObject = 
	{
      'userId': req.body.userId,
      'billingAddress': req.body.billingAddress,
      'skills': req.body.skills,
      'about': req.body.about,
      'transport': req.body.transport,
      'languages': req.body.languages,
      'created_by': 1,
      'createdAt': new Date(),
      'updated_by': 1,
      'updatedAt': new Date()
    }
    return userDetails.create(userDetailsObject, { transaction: t }).then(userDetails => 
	{
      return userDetails;
    });
  }).then(result => {
    // Transaction has been committed
    // result is whatever the result of the promise chain returned to the transaction callback
    res.status(200).json(result);
  }).catch(err => {
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
    // console.log(err);
    res.status(500).json(err);
  });

}


exports.updateUserDetails = function (req, res) 
{
  return models.sequelize.transaction(t => 
  {
    let user_id = req.decoded.user_id;

    var userDetailsObject = {
      'billingAddress': req.body.billingAddress,
      'skills': req.body.skills,
      'about': req.body.about,
      'transport': req.body.transport,
      'languages': req.body.languages,
      'dateOfBirth': req.body.date_of_birth,
      'aadharNumber': req.body.aadharNumber,
      'license': req.body.license,
      'facebookId': req.body.facebookId,
      'mailNotification': req.body.mailNotification,
      'smsNotification': req.body.smsNotification,
      'pushNotification': req.body.pushNotification,
      'updated_by': user_id,
      'updatedAt': new Date()
    }
	console.log(req.body);
    return userDetails.update(userDetailsObject, { where: { 'user_id': user_id } }, { transaction: t }).then(userDetails => {

      var userObject = {
        'full_name': req.body.name,
        'email': req.body.email,
        'updated_by': user_id,
        'updatedAt': new Date()
      }
      return users.update(userObject, { where: { 'user_id': user_id } }, { transaction: t }).then(users => {
        return users;
      })

    });
  }).then(result => {
    responseObject = {
      success: true,
      message: 'user Updated Successfully',
      data: result
    }
    res.status(200).json(responseObject);

    // Transaction has been committed
    // result is whatever the result of the promise chain returned to the transaction callback

  }).catch(err => 
  {
    console.log(err);
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
    res.status(500).json(err);
  });
}

exports.forgotPassword = function (req, res) 
{

  let username = req.body.username;

  return users.findOne({ where: { email: username } }).then((user_data) => {
    if (user_data) {

      var randomPin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

      var passwordResetAttributes = {};
      passwordResetAttributes.passwordResetToken = randomPin;
      passwordResetAttributes.resetRequestedDateTime = new Date();

      var userWhere = {};
      userWhere.email = username;

      users.update(passwordResetAttributes, { where: userWhere }).then(info => {

        // setup e-mail data with unicode symbols
        var mailOptions = {
          from: "Does <admin@does.com>", // sender address
          to: user_data['email'], // list of receivers
          subject: "Forgot Password - Does", // Subject line
          html: "<b>One Time Password -" + randomPin + "</b>" // html body
        }

        mail.sendMail(mailOptions).then(response => {
          responseObject = { 'success': true, 'message': 'OTP has been sent Successfully', 'data': null }

          // sms.sendSms().then(response=>{
          //   console.log(response);
          // });

          res.status(200).send(responseObject);
        });

      })

    } else {
      responseObject = { 'success': false, 'error': 'Invalid Username', 'data': null }
      res.status(200).send(responseObject);
    }

  })


}

exports.verifyMobileNumber = function (req, res) 
{

  let mobileNumber = req.body.mobile;
  let userId = req.body.user_id;

  var randomPin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

  var mobileTokenAttributes = {};
  mobileTokenAttributes.mobileToken = randomPin;
  mobileTokenAttributes.tokenDateTime = new Date();
  mobileTokenAttributes.mobile = mobileNumber;


  users.update(mobileTokenAttributes, { where: { user_id: userId } }).then(info => {

    if (info[0]) 
	{

      let template = "Dingu: Your one-time verification code is: " + randomPin + " Msg&data rates may apply";

      var smsOptions = 
	  {
        mobileNumber: mobileNumber,
        textMessage: template
      }
      sms.sendSms(smsOptions).then(response => 
	  {
        res.json({
          success: true,
          message: 'OTP has Sent Successfully'
        });
      });

    } else {
      res.json({
        success: false,
        err: "user doesn't exist"
      });
    }
  });

}

exports.verifyMobileOtp = function (req, res) 
{
  let oneTimePassword = req.body.oneTimePassword;

  let userId = req.body.user_id;
  return users.findOne({ where: { user_id: userId } }).then((user_data) => {

    if (user_data["mobileToken"] == oneTimePassword) 
	{

      var dateNow = new Date();

      var responseTime = (user_data['tokenDateTime'].getTime() - dateNow.getTime()) / 1000;

      if (responseTime < 180)
	  {
		var sqlQuery = "update users set is_active='1',mobile_verified='1' where user_id='"+userId+"'";
		db.query(sqlQuery, { type: db.QueryTypes.SELECT })
		.then(taskdata => 
		{
		});

         let template = "Welcome to Dingu Does..Thank you for joining the dingu does service.";
		  var smsOptions = 
		  {
			mobileNumber: user_data.dataValues.mobile,
			textMessage: template
		  }
		  sms.sendSms(smsOptions).then(response => 
		  {
			res.json({
			  success: true,
			  message: 'OTP has Sent Successfully'
			});
		  });
		 var mailOptions = {
		  from: "no-reply@dingudoes.com", // sender address
		  to: user_data.dataValues.email, // list of receivers
		  subject: "Registeration-Does", // Subject line
		  html: template // html body
		}
	mail.sendMail(mailOptions).then(response => 
	{responseObject = {'success': true}});
      


        users.update({ mobile_verified: 1 }, { where: { user_id: userId } }).then(info => {
          responseObject = { 'success': true, 'message': 'Mobile Number Verified Successfully' }
          res.status(200).send(responseObject);
        });


      } else {
        responseObject = { 'success': true, 'message': 'OTP Expired' }
        res.status(200).send(responseObject);
      }

    } else {
      responseObject = { 'success': true, 'message': 'Incorrect OTP' }
      res.status(200).send(responseObject);
    }
  });

}


exports.verifyOtp = function (req, res) 
{
  let oneTimePassword = req.body.oneTimePassword;
  let username = req.body.username;

  return users.findOne({ where: { email: username } }).then((user_data) => 
  {

    if (user_data["passwordResetToken"] == oneTimePassword) 
	{

      var dateNow = new Date();
      // console.log(dateNow);
      // console.log(user_data['resetRequestedDateTime']);
      // var responseTime = Math.abs(user_data['resetRequestedDateTime'] - dateNow) / 1000;
      var responseTime = (user_data['resetRequestedDateTime'].getTime() - dateNow.getTime()) / 1000;

      if (responseTime < 180) 
	  {
        let token = jwt.sign({ username: username }, config.secret, { expiresIn: '24h' });

        responseObject = { 'success': true, 'message': 'OTP Verified Successfully', 'token': token }
        res.status(200).send(responseObject);
      } else {
        responseObject = { 'success': true, 'message': 'OTP Expired', 'data': null }
        res.status(200).send(responseObject);
      }

    }


  });

}

exports.verifylogin = function (req, res) 
{
  let oneTimePassword = req.body.oneTimePassword;
  let user_id = req.body.user_id;
 console.log(req.body);
  return users.findOne({ where: { user_id: user_id } }).then((user_data) => 
  {
	
    if(user_data["mobileToken"] == oneTimePassword) 
	{
      var dateNow = new Date();
      var responseTime = (user_data['tokenDateTime'].getTime() - dateNow.getTime()) / 1000;
      if (responseTime < 180) 
	  {
		 var sqlQuery = "update users set is_active='1',mobile_verified='1' where user_id='"+user_id+"'";
		db.query(sqlQuery, { type: db.QueryTypes.SELECT })
		.then(taskdata => 
		{
		});
		  let token = jwt.sign({ username: user_data['email'], user_id: user_data.user_id }, config.secret, { expiresIn: '24h' });
		  
		  let data = {};
		  data.email = user_data.email;
		  data.phoneNumber = user_data.mobile;
		  data.fullName = user_data.full_name;
		  data.userId = user_data.user_id;
		  data.referer_code = user_data.referer_code;
		  data.wallet = user_data.wallet;

		  responseObject = 
		  {
			success: true,
			message: 'Authentication successful!',
			token: token,
			'otp':false,
			data: data
		  }
        //responseObject = { 'success': true, 'message': 'OTP Verified Successfully', 'token': token }
        res.status(200).send(responseObject);
      }
	  else 
	  {
        responseObject = { 'success': false, 'message': 'OTP Expired', 'data': null }
        res.status(200).send(responseObject);
      }

    }
	else
	{
		responseObject = { 'success': false, 'message': 'Invalid Otp', 'data': null }
        res.status(200).send(responseObject);
	}


  });
}
exports.setPassword = function (req, res) 
{
  let token = req.body.token;

  jwt.verify(token, config.secret, (err, decoded) => 
  {
    if (err) 
	{
      return res.json({
        success: false,
        message: 'Token is not valid'
      });
    } 
	else
	{
      req.decoded = decoded;
      let passwordHash = pwdhash.hash(req.body.password);
      users.update({ password: passwordHash }, { where: { email: decoded.username } }).then(info => 
	  {
        res.json({
          success: true,
          message: 'Password Updated Successfully',
          data: info
        });
      });
    }
  });

}



exports.getDashboardDetails = function (req, res) 
{
  let sqlQuery = "SELECT sum(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS 'posterOpen',sum(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS 'posterAssigned', sum(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS 'posterCompleted'  FROM dingu.task where created_by = ?";
  let taskerQuery = "SELECT sum(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS 'taskerOpen', sum(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS 'taskerAssigned', sum(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS 'taskerCompleted' FROM task a LEFT JOIN quote b on b.task_id = a.id WHERE user_id = ?";
  let result = {};
  db.query(sqlQuery, { replacements: [req.params.id], type: db.QueryTypes.SELECT })
    .then(posterMetrics => 
	{
      result["asPoster"] = posterMetrics;
      db.query(taskerQuery, { replacements: [req.params.id], type: db.QueryTypes.SELECT }).then(taskerMetrics => {
        result["asTasker"] = taskerMetrics;
        responseObject = { 'success': true, 'data': result }
        res.status(200).send(responseObject);
      })

    })

}

// exports.getDashboardDetails = function(req,res){

//   let userId = req.params.id;
//   var assignedCount;
//   var completedCount;

//   return task.count({  where:{status:"assigned"},include : [{model: quotes, where:{user_id:userId,isAccepted:1}}]})
//           .then((assigned)=>{ this.assignedCount = assigned;
//                               this.completedCount = task.count({  where:{status:"completed"},include : [{model: quotes, where:{user_id:userId,isAccepted:1}}]}); }).then()
//           .then((response)=>{

//             let responseObject = {
//               success: true,
//               data:{
//                 tasker:{
//                   openForOffers:12,
//                   assigned:this.assignedCount,
//                   completed:this.completedCount        
//                 },
//                 poster:{
//                   posted:11,
//                   completed:9
//                 }
//               }
//             }

//             res.json(responseObject);
//           })




// }

exports.externalAuth = function (req, res) 
{
  let provider = req.body.provider;
  let identifier = req.body.identifier;
  let name = req.body.name;
  let email = req.body.email;
  let mobile = req.body.mobile;
  var gmail_key = '';
  var facebook_key = '';

  if (provider == "GMAIL") 
  {
    gmail_key = identifier;
  } 
  else if (provider == "FACEBOOK") 
  {
    facebook_key = identifier;
  }

//console.log(req.body);
  return users.findOne({ where: { email: email } }).then((user_data) => 
  {

    if (!user_data)
	{
      createExternalUser(email, name, mobile, facebook_key, gmail_key).then(function (response) 
	  {
        res.status(200).send(response);
      }).catch(err => {
        console.log(err);
      });
    } 
	else 
	{
      users.findByPk(user_data.user_id).then((response_data) => 
	  {
        let token = jwt.sign({ username: response_data.email, user_id: response_data.user_id }, config.secret, { expiresIn: '24h' });
        let data = {};
        data.email = response_data.email;
        data.phoneNumber = response_data.mobile;
        data.fullName = response_data.full_name;
        data.userId = response_data.user_id;
        responseObject = {
          success: true,
          message: 'Authentication successful!',
          token: token,
          data: data
        }
        res.status(200).send(responseObject);
      })
    }

  });
}


function createExternalUser(email, name, mobile, facebook_key, gmail_key) 
{
  return new Promise(function (resolve, reject) 
  {
    return models.sequelize.transaction(t => 
	{
      var userObject = 
	  {
        'email': email,
        'full_name': name,
        'mobile': mobile,
        'post_task': 1,
        'complete_task': 1,
        'user_type': 2,
        'facebook_key': facebook_key,
        'gmail_key': gmail_key
      }
      return users.create(userObject, { transaction: t }).then(user => 
	  {
        let userDetailsObject = {
          'userId': user.user_id,
          'created_by': 1,
          'createdAt': new Date(),
          'updated_by': 1,
          'updatedAt': new Date()
        }
        return userDetails.create(userDetailsObject, { transaction: t }).then(userDetails => {
          console.log(userDetails);
          return userDetails;
        });
      });
    }).then(result => {
      // Transaction has been committed
      // result is whatever the result of the promise chain returned to the transaction callback
      // responseObject = {
      //   success: true,
      //   message: 'user Created Successfully',
      //   data: result
      //  }
      console.log(result);
      users.findByPk(result.userId).then((response_data) => {
        console.log(response_data);
        let token = jwt.sign({ username: response_data.email, user_id: response_data.user_id }, config.secret, { expiresIn: '24h' });
        let data = {};
        data.email = response_data.email;
        data.phoneNumber = response_data.mobile;
        data.fullName = response_data.full_name;
        data.userId = response_data.user_id;

        responseObject = {
          success: true,
          message: 'Authentication successful!',
          token: token,
          data: data
        }

        resolve(responseObject);
      })
    }).catch(err => {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
      responseObject = { 'success': false, 'error': err.errors }
      reject(responseObject);
    });

  });

}

exports.getAllUsers = function (req, res) 
{
  return users.findAll({include:[{ model: userDetails }]}).then((user_data) => 
  {
    res.status(200).json(user_data);
  });

}

exports.uploadProfilePic = function (req, res) 
{
  var response = {
    "success": true,
    "message": "", data: {
    }
  };

  uploadService.createSingleAttachment(req, 'profile', req.decoded.user_id).then((result) => 
  {
    console.log(result);

    return users.update({ 'profileImage': result.path }, { where: { 'user_id': req.decoded.user_id } }).then(users => {
      response.message = "Profile pic uploaded successfully."
      response.data.path = result.path;
      response.data.user_id = req.decoded.user_id;
      res.status(200).json(response);
    })

  }).catch(err => {

    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback      
    res.status(500).json(err);
  });
}

exports.uploadBanner = function (req, res) 
{
  var response = {
    "success": true,
    "message": "", data: {
    }
  };

  uploadService.createSingleAttachment(req, 'banner', req.decoded.user_id).then((result) => 
  {
    console.log(result);

    return users.update({ 'BannerImage': result.path }, { where: { 'user_id': req.decoded.user_id } }).then(users => {
		
		console.log(users);
      response.message = "Banner uploaded successfully."
      response.data.path = result.path;
      response.data.user_id = req.decoded.user_id;
      res.status(200).json(response);
    })

  }).catch(err => {

    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback      
    res.status(500).json(err);
  });
}
exports.getsubcategires = function (req, res) 
{
  let filter = { status: 'Active'};
  return subcategires.findAll({ where: filter, attributes: ['id', 'name'] }).then((result) => {
    let responseObject = 
	{
      "success": true,
      "data": result
    }
    res.status(200).json(responseObject);
  }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': null }
    res.status(400).send(responseObject);
  });
}


exports.settings = function (req, res) 
{
     var sqlQuery = "SELECT type,text,text_color as color,background_color as background from app_settings where 1=1";
	db.query(sqlQuery, { type: db.QueryTypes.SELECT })
    .then(taskdata => 
    {
		if(taskdata.length>0)
		{
		  let responseObject = {"success": true,"data": taskdata}
          res.status(200).json(responseObject);
		}
		else
		{
			 let responseObject = {"success": false,"data":[]}
			 res.status(400).json(responseObject);
		}
    }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(400).send(responseObject);
  });
}

exports.getmessages = function(request, res) 
{
	 var sqlQuery = "SELECT * from messages  WHERE (sender = '" + request.body.sender + "' AND receiver = '" + request.body.receiver + "') OR (sender = '" + request.body.receiver + "' AND receiver = '" + request.body.sender + "')";
	db.query(sqlQuery, { type: db.QueryTypes.SELECT })
    .then(taskdata => 
    {
		console.log(taskdata);
	    if(taskdata.length>0)
		{
		  let responseObject = taskdata;
           res.status(200).json(responseObject);
		}
		else
		{
			 let responseObject = {"success": false,"data":[]}
			 res.status(400).send(responseObject);
		}
    }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(400).send(responseObject);
	  });
}

exports.user_messages = function(request, res) 
{
	console.log(request.body);
	var chatroomsquwey= "SELECT * from chat_rooms  WHERE  task_id='"+request.body.task_id+"' and ( (user1 = '" + request.body.sender + "' AND user2 = '" + request.body.receiver + "' ) OR (user1 = '" + request.body.receiver + "' AND user2 = '" + request.body.sender + "'))";
	////console.log(sqlQuery);
	db.query(chatroomsquwey, { type: db.QueryTypes.SELECT })
    .then(chatroom => 
    {
	    var sqlQuery = "SELECT id, send_user_id as sender,receive_user_id as receiver,msg as  message from chat_messages   WHERE  room_id='"+chatroom[0].room_id+"' and ( (send_user_id = '" + request.body.sender + "' AND receive_user_id = '" + request.body.receiver + "' ) OR (send_user_id = '" + request.body.receiver + "' AND receive_user_id = '" + request.body.sender + "'))";
	////console.log(sqlQuery);
	db.query(sqlQuery, { type: db.QueryTypes.SELECT })
    .then(taskdata => 
    {
		console.log(taskdata);
	    if(taskdata.length>0)
		{
		  let responseObject = taskdata;
           res.status(200).json(responseObject);
		}
		else
		{
			 let responseObject = {"success": false,"data":[]}
			 res.status(200).send(responseObject);
		}
    }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(400).send(responseObject);
	  });
	}).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(200).send(responseObject);
	  });
}
 
exports.getadminconnection = function(request, res) 
{
    /*var server = "http://35.154.117.45:8080/";
    var io = io(server);*/
	console.log(request.body); 
	io.emit('user_connected',request.body.UserId);
	res.status(200).send();
	
	var sqlQuery = "SELECT * from messages  WHERE (sender = 'admin' AND receiver = '" + request.body.UserId + "') OR (sender = '" + request.body.UserId + "' AND receiver = 'admin')";
    console.log(sqlQuery);
	db.query(sqlQuery, { type: db.QueryTypes.SELECT })
    .then(taskdata => 
    {
		console.log(taskdata);
	    if(taskdata.length>0)
		{
		  let responseObject = taskdata;
           res.status(200).json(responseObject);
		}
		else
		{
			 let responseObject = {"success": false,"data":[]}
			 res.status(400).send(responseObject);
		}
    }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(400).send(responseObject);
	  }); 
}

exports.sendadminmessage = function(request, res) 
{
	console.log(request.body);
	 const io = request.app.get('socketio'); //Here you use the exported socketio module
	io.emit("user_connected", request.body.UserId);
	io.emit("send_message",{"sender": request.body.UserId,"receiver": 'admin',"message": request.body.message});
	var sqlQuery = "SELECT * from messages  WHERE (sender = 'admin' AND receiver = '" + request.body.UserId + "') OR (sender = '" + request.body.UserId + "' AND receiver = 'admin')";
    console.log(sqlQuery);
	db.query(sqlQuery, { type: db.QueryTypes.SELECT })
    .then(taskdata => 
    {
		console.log(taskdata);
		  let responseObject = taskdata;
           res.status(200).json(responseObject);

    }).catch(err => {
    responseObject = { 'success': false, 'error': err, 'data': [] }
    res.status(400).send(responseObject);
	  });
}
/*
exports.respond = function(endpoint,socket)
{
    socket.on('news',function(newsreel)
	{
        
    });
} */
/* 
module.exports = function(io)
{
    var that={};

    const _io = io; 

    that.getadminconnection = function(req,res)
	{
        _io.emit('user_connected','hello world');
        res.send('Done');   
    }

    // everything attached to that will be exposed
    // more like making public member functions and properties.
    return that;
} */



/* 
exports.sendadminme  = {

    connect: function(server) {
        io = socketIO(server);
    },

    emit: function(event, values) {
        if (io) {
            io.sockets.emit(event, values);
        }
    }
} */