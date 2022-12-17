const { check, validationResult } = require('express-validator');
exports.validatecircles = [
    check('circle_no')
    .notEmpty() 
    .withMessage('Circle No. is required'),
    check('name')
    .notEmpty() 
    .withMessage('Circle Name is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent Name is required'),
    check('zones_id')
    .notEmpty() 
    .withMessage('Please select zone'), 
    check('created_by')
    .notEmpty() 
    .withMessage('Created User is required'),
]; 



exports.isRequestValidatedcircle = (req, res, next) => {
    const errors = validationResult(req);
  
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg,login:true,success:false })
    } 
    next(); 
}    


exports.validatecircleid = [
    check('circle_id')
    .notEmpty()
    .withMessage('Circle Id is required'), 
]  

exports.isRequestValidatedCircleId = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}