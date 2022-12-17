const { check, validationResult } = require('express-validator');
exports.validatenotification = [
    check('title')
    .notEmpty() 
    .withMessage('Title is required'),
    check('message')
    .notEmpty()  
    .withMessage('Message is required'),
    check('status')
    .notEmpty() 
    .withMessage('Status is required'),
    check('time')
    .notEmpty() 
    .withMessage('Time is required'),
    check('geotagtypes_id')
    .notEmpty() 
    .withMessage('Geo name is required'),  
    check('department_id')
    .notEmpty()  
    .withMessage('Department name is required'),  
    check('tenent_id')
    .notEmpty()  
    .withMessage('Tenent name is required'),
]; 

   

exports.isRequestValidatenotification = (req, res, next) => {  
    const errors = validationResult(req); 
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })  
    } 
    next(); 
} 