const { check, validationResult } = require('express-validator');


exports.validate_gvpbep_admin = [
    check('type')
    .notEmpty()
    .withMessage('Select type'),
    check('lattitude')
    .notEmpty() 
    .withMessage('Lattitude is required'),
    check('longitude')
    .notEmpty()
    .withMessage('Longitude is required'),
    check('area')
    .notEmpty()
    .withMessage('Area is required'),
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
]; 



exports.isRequestValidated_admin_gvpbep = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}