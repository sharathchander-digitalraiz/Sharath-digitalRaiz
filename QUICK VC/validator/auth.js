const { check, validationResult } = require('express-validator');
exports.validate_login = [
    check('email')
    .notEmpty() 
    .withMessage('Please enter email'),
    check('password')
    .notEmpty() 
    .withMessage('Please enter password')
];

  

exports.isRequestvalidatelogin = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"message":errors.array()[0].msg});
    } 
    next(); 
} 