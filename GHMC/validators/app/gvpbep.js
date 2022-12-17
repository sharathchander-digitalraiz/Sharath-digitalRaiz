const { check, validationResult } = require('express-validator');
exports.validategvpbep = [
    check('user_id')
    .notEmpty() 
    .withMessage('user id is required'),
    check('date')
    .notEmpty() 
    .withMessage('Select date')
];

exports.isRequestvalidategvpbep = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 

exports.validateaddgvpbep = [
    check('user_id')
    .notEmpty() 
    .withMessage('user id is required'),
    check('id')
    .notEmpty() 
    .withMessage('id is required'),
    check('address')
    .notEmpty() 
    .withMessage('address is required'),
    check('latitude')
    .notEmpty() 
    .withMessage('latitude is required'),
    check('longitude')
    .notEmpty() 
    .withMessage('longitude is required'),
];

exports.isRequestvalidateaddgvpbep = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 
exports.validateadd_newgvpbep = [
    check('user_id')
    .notEmpty() 
    .withMessage('user id is required'),
    check('type')
    .notEmpty() 
    .withMessage('type is required'),
    check('landmark')
    .notEmpty() 
    .withMessage('landmark is required'),
    check('ward')
    .notEmpty() 
    .withMessage('ward is required'),
    check('circle')
    .notEmpty() 
    .withMessage('circle is required'),
    check('zone')
    .notEmpty() 
    .withMessage('zone is required'),
    check('lattitude')
    .notEmpty() 
    .withMessage('lattitude is required'),
    check('longitude')
    .notEmpty() 
    .withMessage('longitude is required'),
];

exports.isRequestadd_newvalidateaddgvpbep = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"login":true,"message":errors.array()[0].msg});
    } 
    next(); 
} 