const { check, validationResult } = require('express-validator');
exports.validate_operations = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check("collection_id")
    .notEmpty()
    .withMessage('The collection id is required'),
   
    check("db_type")
    .notEmpty()
    .withMessage('The collection name field is required'),
    check("picked_denied") 
    .notEmpty()
    .withMessage('Select picked or denied is required'),
  
];
exports.isRequestvalidate_operation = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    {    
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});            
    } 
    next(); 
}   