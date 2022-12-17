const { check, validationResult } = require('express-validator');
exports.validatesupport = [
    check('user_id')
    .notEmpty() 
    .withMessage('user id is required'),
    // check('zones_id')
    // .notEmpty() 
    // .withMessage('Please select zone'),
    // check('circles_id')
    // .notEmpty() 
    // .withMessage('Please select circle'),
    check('support_list_id')
    .notEmpty() 
    .withMessage('Select complaint'),
    check('description')
    .notEmpty() 
    .withMessage('Enter a description')
];

exports.isRequestvalidatesupport = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 