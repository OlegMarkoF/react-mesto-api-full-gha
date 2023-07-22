const router = require('express').Router();
const { UserNotFound } = require('../errors/not-found-err');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlwares/auth');

// router.use(userRoutes);
// router.use(cardRoutes);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use('/*', (req, res, next) => {
  next(new UserNotFound());
});

module.exports = router;
