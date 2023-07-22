require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const router = require('./routes');

const errorHandler = require('./middlwares/error');

const app = express();
const auth = require('./middlwares/auth');
const cors = require('./middlwares/cors');

const { RegURL } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlwares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cors);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signup',
  validationSignup,
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(cookieParser());
app.use(auth);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
