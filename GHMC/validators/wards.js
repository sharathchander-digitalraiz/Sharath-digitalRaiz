const { check, validationResult } = require('express-validator');
exports.validatewards = [
    check('wards_no')
    .notEmpty() 
    .withMessage('Ward no. is required'),
    check('name')
    .notEmpty() 
    .withMessage('Ward  Name is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('Circle  is required'),
    check('zones_id')
    .notEmpty() 
    .withMessage('zones  is required')
];

  

exports.isRequestValidatedward = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 