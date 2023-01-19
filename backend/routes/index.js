const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { logOut } = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./cards'));
router.use('/signout', logOut);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
