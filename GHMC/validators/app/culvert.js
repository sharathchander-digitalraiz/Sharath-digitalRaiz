const { check, validationResult } = require('express-validator');
exports.validatezonelist = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required')
];
exports.isRequestValidatedzonelist = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 
exports.validatecirclelist = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('zone_id')
    .notEmpty() 
    .withMessage('zone_id is required')
];
exports.isRequestValidatedcirclelist = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 


exports.validatearealandlist = [
    
    check('area_id')
    .notEmpty() 
    .withMessage('area_id is required')
];
exports.isRequestValidatedarealandlist = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 




exports.validatewardslist = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('circle_id')
    .notEmpty() 
    .withMessage('circle_id is required')
];
exports.isRequestValidatedwardslist = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 



exports.validatearealist = [
    check('ward_id')
    .notEmpty() 
    .withMessage('ward_id is required')
];
exports.isRequestValidatedarealist = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 


/****ADD Culvert ********/
exports.validateculvert = [
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
    check('landmark')
    .notEmpty() 
    .withMessage('The landmark field is required'),
    check('latittude').notEmpty().withMessage("The latittude field is required"),
    check('longitude').notEmpty().withMessage("The longitude field is required"),
    check('location').notEmpty().withMessage("The location field is required"),
    check('area').notEmpty().withMessage("The area is required"),
    check('type').notEmpty().withMessage("The type is required"),
    check('name').notEmpty().withMessage("The name is required"),
    check('depth').notEmpty().withMessage("The depth is required")
];
exports.isRequestValidatedculvert = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/



/****ADD Culvert ********/
exports.validateupdateculvert = [
    check('id')
    .notEmpty() 
    .withMessage('id is required'),
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
    check('landmark')
    .notEmpty() 
    .withMessage('The landmark field is required'),
    check('latittude').notEmpty().withMessage("The latittude field is required"),
    check('longitude').notEmpty().withMessage("The longitude field is required"),
    check('location').notEmpty().withMessage("The location field is required"),
    check('area').notEmpty().withMessage("The area is required"),
    check('type').notEmpty().withMessage("The type is required"),
    check('name').notEmpty().withMessage("The name is required"),
    check('depth').notEmpty().withMessage("The depth is required")
];
exports.isRequestupdateValidatedculvert = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/



/****Issue Culvert ********/
exports.validateculvertissue = [
    check('culvert_id')
    .notEmpty() 
    .withMessage('culvert_id is required'),
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('isse_type_id')
    .notEmpty() 
    .withMessage('isse_type_id field is required'),
    check('depth')
    .notEmpty() 
    .withMessage('Please select detpth')
];
exports.isRequestupdateculvertissue = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/

