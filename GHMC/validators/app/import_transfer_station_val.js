const { check, validationResult } = require('express-validator');
exports.validate_import_tran_sta = [
    check('user_id')
    .notEmpty() 
    .withMessage('User Name is required'),
    check('transfer_station_userid')
    .notEmpty() 
    .withMessage('Transfer station is required'),
    check('address')
    .notEmpty() 
    .withMessage('Address is required'),
    check('longitude')
    .notEmpty() 
    .withMessage('Longitude is required'),
    check('lattitude')
    .notEmpty() 
    .withMessage('Longitude is required'),
    // check('image')
    // .notEmpty() 
    // .withMessage('Image is required')
];

  

exports.isReq_val_import_tansfer_sta = (req, res, next) => 
{
    console.log(req.body);
    const errors = validationResult(req);
    if(errors.array().length > 0)
    { 
        return res.status(400).json({ "success":false,"message":errors.array()[0].msg});
    } 
    next(); 
} 