const { check, validationResult } = require('express-validator');
exports.validatedepartment = [
    check('name')
    .notEmpty() 
    .withMessage('Department name is required'),
    check('created_by')
    .notEmpty()
    .withMessage('Created User is required'),
];   

  

exports.isRequestValidateddepartment = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}
