const usersRouter = require('express').Router();
const {
  validateId, validateUserUpdate, validateAvatar,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:_id', validateId, getUserById);
usersRouter.patch('/users/me', validateUserUpdate, updateUser);
usersRouter.patch('/users/me/avatar', validateAvatar, updateAvatar);

module.exports = usersRouter;
