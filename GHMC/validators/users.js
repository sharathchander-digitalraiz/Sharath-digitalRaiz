const { check, validationResult } = require('express-validator');
exports.validateusers = [
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
    check('category_id')
    .notEmpty() 
    .withMessage('category . is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent is required')
];

  

exports.isRequestValidateuser = (req, res, next) => 
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
exports.validateupdateusers = [
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
    // check('username')
    // .notEmpty() 
    // .withMessage('username . is required'),
    // check('password')
    // .notEmpty() 
    // .withMessage('password . is required'),
    check('status')
    .notEmpty() 
    .withMessage('status . is required'),
    check('category_id')
    .notEmpty() 
    .withMessage('category . is required')

];

  

exports.isRequestValidateupdateuser = (req, res, next) => 
{
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 
