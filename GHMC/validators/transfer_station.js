const { check, validationResult } = require('express-validator');
exports.validatetransfer_station = [
    check('tenent_id')
    .notEmpty() 
    .withMessage('tenent id is required'),
    check('vehicle_type')
    .notEmpty()  
    .withMessage('Select a vehicle type'),
    check('circle_id')
    .notEmpty() 
    .withMessage('Select a circle'),
    check('ward_id')
    .notEmpty() 
    .withMessage('select a ward'),
    check('zone_id')
    .notEmpty() 
    .withMessage('select a zone'),  
    check('user_id')
    .notEmpty()  
    .withMessage('user id is required'),
    check('from_date')
    .notEmpty()  
    .withMessage('from date is required'),
    check('to_date')
    .notEmpty()  
    .withMessage('to date is required')
]; 

   

exports.isRequestValidatedtransfer_station = (req, res, next) => {  
    const errors = validationResult(req); 
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })  
    } 
    next(); 
} 

