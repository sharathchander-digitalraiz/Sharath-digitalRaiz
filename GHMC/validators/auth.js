const { check, validationResult } = require('express-validator');
exports.validate_login = [
    check('username')
    .notEmpty() 
    .withMessage('User Name is required'),
    check('password')
    .notEmpty() 
    .withMessage('Password is required')
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