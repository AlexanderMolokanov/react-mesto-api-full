const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const  { logOut } = require('../controllers/users');
// const auth = require('../middlewares/auth');

// router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./cards'));
router.use('/signout', logOut);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
