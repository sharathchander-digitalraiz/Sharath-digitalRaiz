const { check, validationResult } = require('express-validator');
exports.validatedisposal_type = [
    check('name')
    .notEmpty() 
    .withMessage('name is required'),
    check('user_id')
    .notEmpty()
    .withMessage('User is required'),
    check('tenent_id')
    .notEmpty()
    .withMessage('Tenent is required'),
    check('status')
    .notEmpty()
    .withMessage('Status is required'),
];   

   

exports.isRequestValidatedisposal_type = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){  
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}


