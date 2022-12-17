const { check, validationResult } = require('express-validator');
exports.validateusers_super = [
    check('first_name')
    .notEmpty() 
    .withMessage('First name . is required'),
    check('last_name')
    .notEmpty() 
    .withMessage('Last name . is required'),
    check('department_id')
    .notEmpty() 
    .withMessage('department id . is required'),
    check('username') 
    .notEmpty() 
    .withMessage('username . is required'),
    check('password')
    .notEmpty() 
    .withMessage('password . is required'),
    check('status')
    .notEmpty() 
    .withMessage('status . is required'), 
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent is required')
];

  

exports.isRequestValidateuser_super = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 



exports.validatesingleusers = [
    check('id')
    .notEmpty() 
    .withMessage('user Id is required')
];

  

exports.isRequestvalidatesingleusers = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 
exports.validateupdateusers_super = [
    check('id')
    .notEmpty() 
    .withMessage('id . is required'),
    check('first_name')
    .notEmpty() 
    .withMessage('First name . is required'),
    check('last_name')
    .notEmpty() 
    .withMessage('Last name . is required'),
    check('department_id')
    .notEmpty() 
    .withMessage('department_id . is required'),
    check('status')
    .notEmpty() 
    .withMessage('status . is required'),


];

  

exports.isRequestValidateupdateuser_super = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 
