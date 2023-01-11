const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.use('/', require('./users'));
router.use('/', require('./cards'));

router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
