const { check, validationResult } = require('express-validator');
exports.validatearea = [
     check('zones_id')
    .notEmpty() 
    .withMessage('Zone Name is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('Circle Name is required'),  
    check('wards_id')
    .notEmpty() 
    .withMessage('Select a ward'),
    check('name')
    .notEmpty()  
    .withMessage('Ward Name is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent Name is required'),
    check('user_id')
    .notEmpty()  
    .withMessage('update user is required'),  
 check('id')
    .notEmpty()  
    .withMessage('id is required'),  
]; 

   

exports.isRequestValidatedarea = (req, res, next) => {  
    const errors = validationResult(req); 
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })  
    } 
    next(); 
} 


exports.validataddearea = [
     check('zones_id')
    .notEmpty() 
    .withMessage('Zone Name is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('Circle Name is required'),  
    check('name')
    .notEmpty() 
    .withMessage('Enter a area name '),
    check('wards_id')
    .notEmpty() 
    .withMessage('Ward Id. is required'),
    check('name')
    .notEmpty()  
    .withMessage('Ward Name is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent Name is required'),
   
    check('created_by')
    .notEmpty()  
    .withMessage('Create Name is required'),  
]; 

   

exports.isRequestvalidataddearea = (req, res, next) => {  
    const errors = validationResult(req); 
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false,login:true })  
    } 
    next(); 
} 