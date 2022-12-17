const { check, validationResult } = require('express-validator');
exports.validate_operations_toilets = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'), 
    check("collection_id")
    .notEmpty()
    .withMessage('The collection id is required'),
     check("operation_type")
     .notEmpty()
     .withMessage('Select operation type'),
];
exports.isRequestvalidate_operation_toilets = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    {    
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});            
    } 
    next(); 
}   