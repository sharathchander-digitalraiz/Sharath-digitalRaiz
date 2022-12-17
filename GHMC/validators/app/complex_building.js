const { check, validationResult } = require('express-validator');
/****ADD vehicles ********/
exports.validatecommercial_building = [
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
    check("name")
    .notEmpty()
    .withMessage('The name field is required'),
    check("address")
    .notEmpty()
    .withMessage('The address field is required'),
    check("basements")
    .notEmpty()
    .withMessage('The basements field is required'),
    check("ground_floors")
    .notEmpty()
    .withMessage('The ground_floors field is required'),
    check("floors")
    .notEmpty()
    .withMessage('The floors field is required')
];
exports.isRequestvalidatecommercial_building = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/

exports.validateusercomplexlist = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required')
];
exports.isRequestValidatedusercomplex = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 


