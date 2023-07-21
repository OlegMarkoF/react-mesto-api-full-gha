const router = require('express').Router();
const {
  validateId, validateUserUpdate, validateAvatar,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateId, getUserById);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
