const { check, validationResult } = require('express-validator');
exports.validatelandmarks = [
    check('landmark_no')
    .notEmpty() 
    .withMessage('Landmark no. is required'),
    check('landmark_from')
    .notEmpty() 
    .withMessage('Landmark from is required'),  
    check('landmark_to')
    .notEmpty() 
    .withMessage('Landmark to is required'),
    check('tenent_id')
    .notEmpty() 
    .withMessage('Tenent name is required'),
    check('zones_id')
    .notEmpty() 
    .withMessage('Zone name is required'),
    check('circles_id')
    .notEmpty() 
    .withMessage('Circle name is required'),
    check('wards_id')
    .notEmpty() 
    .withMessage('Ward name is required'),
    check('created_by')
    .notEmpty() 
    .withMessage('Created name is required'),
    check('areas_id')
    .notEmpty() 
    .withMessage('Select area')
];

  

exports.isRequestValidatelandmark = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
} 


exports.validatewardid = [
    check('wards_id')
    .notEmpty()
    .withMessage('Ward Id is required'), 
]  

exports.isRequestValidatedWardId = (req, res, next) => {
    const errors = validationResult(req);  
    if(errors.array().length > 0){ 
        return res.status(400).json({ message: errors.array()[0].msg, success:false })
    } 
    next(); 
}