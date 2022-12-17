const { check, validationResult } = require('express-validator');


exports.validate_notifications = [
    check('title')
    .notEmpty()
    .withMessage('Enter a title'),
    check('description')
    .notEmpty() 
    .withMessage('Enter a Description')
]; 



exports.isRequestValidated_notifications= (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}