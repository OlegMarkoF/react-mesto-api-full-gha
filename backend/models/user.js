const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../utils/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(link) {
          return validator.isURL(link);
        },
        message: 'Введен некорректный URL',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: 'Введен некорректный Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email }).select('+password')
          .orFail(() => {
            throw new UnauthorizedError('Введены неправильные почта или пароль');
          })
          .then((user) => bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                throw new UnauthorizedError('Введены неправильные почта или пароль');
              }
              return user;
            }));
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
