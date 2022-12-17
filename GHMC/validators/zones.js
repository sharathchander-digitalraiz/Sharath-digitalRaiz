const { check, validationResult } = require('express-validator');

exports.validateid = [
    check('id')
    .notEmpty()
    .withMessage('Id is required'), 
]
 

exports.isRequestValidatedId = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 

exports.validatezoneid = [
    check('zone_id')
    .notEmpty()
    .withMessage('Zone Id is required'), 
]

exports.isRequestValidatedZoneId = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}


exports.validatezones = [
    check('name')
    .notEmpty()
    .withMessage('Zone name is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent name is required'),
    check('zone_no')
    .notEmpty()
    .withMessage('Zone no is required'),
    check('created_by')
    .notEmpty()
    .withMessage('Created user is required'),
]; 



exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}