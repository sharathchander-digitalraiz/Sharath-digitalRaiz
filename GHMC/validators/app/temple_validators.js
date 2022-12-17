const { check, validationResult } = require('express-validator');
exports.validate_temple = [
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
    check("area_id")
    .notEmpty()
    .withMessage('The area field is required'),
    check("address")
    .notEmpty()
    .withMessage('The address  field is required'),
    check("temple_name")
    .notEmpty()
    .withMessage('The temple name field is required'),
    check("type")
    .notEmpty()
    .withMessage('Please select type'),
   
    check("existing_disposal")
    .notEmpty()
    .withMessage('The existing_disposal is required'),
    check("quality_of_waste")
    .notEmpty()
    .withMessage('The quality_of_waste field is required'),
    check("wastage_quantity")
    .notEmpty()
    .withMessage('The wastage quantity field is required'),
    check("latitude")
    .notEmpty()
    .withMessage('The lattitude field is required'),
    check("longitude")
    .notEmpty()
    .withMessage('The longitude field is required')
];
exports.isRequestvalidate_temple = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    {     
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}   