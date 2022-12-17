const { check, validationResult } = require('express-validator');
/****ADD vehicles ********/
exports.validatevehicles = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('zone_id')
    .notEmpty() 
    .withMessage('The zone Id field is required'),
    check('circle_id')
    .notEmpty() 
    .withMessage('The circle Id field is required'),
    check('ward_id')
    .notEmpty() 
    .withMessage('The ward_id field is required'),
    check('land_mark_id')
    .notEmpty() 
    .withMessage('The landmark field is required'),
    /*check("owner_type_id")
    .notEmpty()
    .withMessage('The  owner_type_id field is required'),*/
    check("reg_no")
    .notEmpty()
    .withMessage('The reg_no field is required'),
    // check("sfa_name")
    // .notEmpty()
    // .withMessage('The sfa_name field is required'),
    // check("sfa_mobile")
    // .notEmpty()
    // .withMessage('The sfa_mobile field is required'),
     check("sfa_id")
    .notEmpty()
    .withMessage('The sfa  field is required'),

    check("driver_name")
    .notEmpty()
    .withMessage('The driver_name field is required'),
    check("driver_mobile")
    .notEmpty()
    .withMessage('The driver_mobile field is required'),
    /*check("transfer_station_id")
    .notEmpty()
    .withMessage('The transfer_station_id field is required'),
    check("area")
    .notEmpty()
    .withMessage('The area field is required'),*/
];
exports.isRequestValidatedvehicles = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/


