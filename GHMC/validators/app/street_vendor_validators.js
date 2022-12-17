const { check, validationResult } = require('express-validator');
exports.validatestreet_vendors = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('zones_id')
    .notEmpty() 
    .withMessage('The zone  field is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('The circle  field is required'),
    check('ward_id')
    .notEmpty() 
    .withMessage('The ward  field is required'),
    check('landmark_id')
    .notEmpty() 
    .withMessage('The landmark field is required'),
    check("business_name")
    .notEmpty()
    .withMessage('The business name field is required'),
    check("business_type")
    .notEmpty()
    .withMessage('The business type field is required'),
    check("owner_name")
    .notEmpty()
    .withMessage('The owner name field is required'),
    check("owner_mobile")
    .notEmpty()
    .withMessage('The owner mobile field is required'),

    check("existing_disposal")
    .notEmpty()
    .withMessage('The existing disposal field is required'),
    check("quality_waste")
    .notEmpty()
    .withMessage('The quality waste field is required'),
    check("wastage_quantity")
    .notEmpty()
    .withMessage('The wastage quantity field is required'),
    check("latitude")
    .notEmpty()
    .withMessage('The lattitude field is required'),
    check("longitude")
    .notEmpty()
    .withMessage('The longitude field is required'),
    check("area_id")
    .notEmpty()
    .withMessage('The area field is required')
];
exports.isRequestvalidatestreet_vendors = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    {   
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}   