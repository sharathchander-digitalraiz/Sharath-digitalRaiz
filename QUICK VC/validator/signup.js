const { check, validationResult } = require('express-validator');
exports.validate_signup = [
    check('firstName')
    .notEmpty() 
    .withMessage('Please enter first name'),
    check('lastName')
    .notEmpty() 
    .withMessage('Please enter last name'),
    check('email')
    .notEmpty() 
    .withMessage('Email is required'),
    check('password')
    .notEmpty() 
    .withMessage('Password is required'),
    check('countrtyCode')
    .notEmpty() 
    .withMessage('Please select country'),
    check('contactNumber')
    .notEmpty() 
    .withMessage('Please enter contact number')
];

  

exports.isRequestvalidateSignup = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"message":errors.array()[0].msg});
    } 
    next(); 
} 