const { check, validationResult } = require('express-validator');
/****ADD vehicles ********/
exports.validatecommercial_building_two = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('floor')
    .notEmpty() 
    .withMessage('The floor  field is required'),
    check('floor_no')
    .notEmpty() 
    .withMessage('The Floor number  field is required'),
    check('category')
    .notEmpty() 
    .withMessage('The Category  field is required'),
    // check('business_type')
    // .notEmpty() 
    // .withMessage('The business type field is required'),
    // check("business_name")
    // .notEmpty()
    // .withMessage('The business name field is required'),
    // check("shop_address")
    // .notEmpty()
    // .withMessage('The shop address field is required'),
    check("owner_name")
    .notEmpty()
    .withMessage('The owner name field is required'),
    check("owner_mobile")
    .notEmpty()
    .withMessage('The owner mobile field is required'),
    // check("owner_aadhar")
    // .notEmpty()
    // .withMessage('The aadhar field is required'),
    // check("licence_number")
    // .notEmpty()
    // .withMessage('The licence field is required'),
    check("existing_disposal")
    .notEmpty()
    .withMessage('The existing disposal field is required'),
    check("approx_quality_waste")
    .notEmpty()
    .withMessage('The quality waste field is required'),
    check("wastage_quantity")
    .notEmpty()
    .withMessage('The Wastage quantity field is required'),
    check("latitude")
    .notEmpty()
    .withMessage('The lattitude field is required'),
    check("longitude")
    .notEmpty()
    .withMessage('The longitude field is required'),
    check("complex_id")
    .notEmpty()
    .withMessage('The complex id field is required')
];
exports.isRequestvalidatecommercial_building_two = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}




/****ADD vehicles ********/
exports.validatecommercial_building_two_update = [
    check('id')
    .notEmpty() 
    .withMessage('Updating Id is required'),
    check('floor')
    .notEmpty() 
    .withMessage('The floor  field is required'),
    check('floor_no')
    .notEmpty() 
    .withMessage('The Floor number  field is required'),
    check('category')
    .notEmpty() 
    .withMessage('The Category  field is required'),
    check('business_type')
    .notEmpty() 
    .withMessage('The business type field is required'),
    check("business_name")
    .notEmpty()
    .withMessage('The business name field is required'),
    check("shop_address")
    .notEmpty()
    .withMessage('The shop address field is required'),
    check("owner_name")
    .notEmpty()
    .withMessage('The owner name field is required'),
    check("owner_mobile")
    .notEmpty()
    .withMessage('The owner mobile field is required'),
    check("owner_aadhar")
    .notEmpty()
    .withMessage('The aadhar field is required'),
    check("licence_number")
    .notEmpty()
    .withMessage('The licence field is required'),
    check("existing_disposal")
    .notEmpty()
    .withMessage('The existing disposal field is required'),
    check("approx_quality_waste")
    .notEmpty()
    .withMessage('The quality waste field is required'),
    check("latitude")
    .notEmpty()
    .withMessage('The lattitude field is required'),
    check("longitude")
    .notEmpty()
    .withMessage('The longitude field is required')
];
exports.isRequestvalidatecommercial_building_two_update = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}