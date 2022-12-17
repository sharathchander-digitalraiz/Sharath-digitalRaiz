const { check, validationResult } = require('express-validator');

/****ADD Culvert ********/
exports.validatescan = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('geo_id')
    .notEmpty() 
    .withMessage('geo_id is required')

];
exports.isRequestValidatescan = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}
/********Add Culvert*/



exports.validatehistory = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required')

];
exports.isRequestvalidatehistory = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}



exports.validateabsentvehicles = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('date')
    .notEmpty() 
    .withMessage('date is required'),
    check('vehicle_type')
    .notEmpty() 
    .withMessage('vehicle_type is required'),


];
exports.isRequestabsentvehicles = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}




exports.validateabsentvehiclescoment = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('date')
    .notEmpty() 
    .withMessage('date is required'),
    check('id')
    .notEmpty() 
    .withMessage('id is required'),
    check('comment')
    .notEmpty() 
    .withMessage('comment is required'),


];
exports.isRequestvalidateabsentvehiclescoment = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}


exports.validatevehiclesubmitscan = [
    check('user_id')
    .notEmpty() 
    .withMessage('user_id is required'),
    check('geo_id')
    .notEmpty() 
    .withMessage('geo_id is required')


];
exports.isRequestvehiclesubmitscan = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
}

