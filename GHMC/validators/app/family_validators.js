const { check, validationResult } = require('express-validator');
exports.validatefamily = [
    check('user_id')
    .notEmpty() 
    .withMessage('User Id is required'),
    check('uuid')
    .notEmpty() 
    .withMessage('UUID is required'),  
    check('name')
    .notEmpty() 
    .withMessage('name to is required'),
    check('age')
    .notEmpty() 
    .withMessage('Age to is required'),
    check('mobile')
    .notEmpty() 
    .withMessage('Mobile number is required'),
    check('gender')
    .notEmpty() 
    .withMessage('Gender is required'),
    check('aadhar')
    .notEmpty() 
    .withMessage('Aadhar No is required'),
    check('vaccine_type')
    .notEmpty() 
    .withMessage('Select vaccination type is required'),
];

  

exports.isRequestValidatefamily = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 

