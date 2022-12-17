const { check, validationResult } = require('express-validator');
exports.validatetenents_geoaccess = [
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent name is required'),
    check('user_id')
    .notEmpty()
    .withMessage('Created User is required'),
    check('geo_tag_access')
    .notEmpty()
    .withMessage('Access is required'),
    check('status')
    .notEmpty()
    .withMessage('status is required'),

];   

  

exports.isRequestValidatedtenents_geoaccess = (req, res, next) => {
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