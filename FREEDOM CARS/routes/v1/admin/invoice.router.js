const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const invoice = require('../../../controller/admin/invoice.controller');


// router.use('/', indexRouter); 
router.get('/:id', invoice.invoicePdf); 

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;