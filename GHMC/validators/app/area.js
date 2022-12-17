const { check, validationResult } = require('express-validator');
exports.validatearea = [
    check('wards_id')
    .notEmpty() 
    .withMessage('Ward Id. is required'),
    check('name')
    .notEmpty()  
    .withMessage('Ward Name is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent Name is required'),
    check('zones_id')
    .notEmpty() 
    .withMessage('Zone Name is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('Circle Name is required'),  
    check('created_by')
    .notEmpty()  
    .withMessage('Create Name is required'),  
]; 

   

exports.isRequestValidatedarea = (req, res, next) => {  
    const errors = validationResult(req); 
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })  
    } 
    next(); 
} 