const { check, validationResult } = require('express-validator');
exports.validatetenents = [
    check('name')
    .notEmpty() 
    .withMessage('Tenent name is required'),
    check('created_by')
    .notEmpty()
    .withMessage('Created User is required'),
    check('city')
    .notEmpty()
    .withMessage('City is required'),
    check('district')
    .notEmpty()
    .withMessage('District is required'),
    check('state')
    .notEmpty()
    .withMessage('State is required'),
];   

  

exports.isRequestValidatedtenent = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}


exports.validatetenentid = [
    check('tenent_id')
    .notEmpty()
    .withMessage('Tenent Id is required'), 
] 

exports.isRequestValidatedTenentId = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}   