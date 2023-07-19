require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const cors = require('./middlewares/cors');
const cors = require('cors');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./utils/NotFoundError');
const auth = require('./middlewares/auth');
const {
  validateUser, validateLogin,
} = require('./middlewares/validation');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors({
  credentials: true,
  origin: [
    'https://markov.project.nomoreparties.sbs',
    'http://markov.project.nomoreparties.sbs',
    'https://api.markov.project.nomoredomains.work',
    'http://api.markov.project.nomoredomains.work',
    'https://praktikum.tk',
    'http://praktikum.tk',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3001',
    'http://localhost:3001',
  ],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.enable('trust proxy');
app.use(rateLimit);

app.use(helmet());
app.use(limiter);

app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use('/', auth, users);
app.use('/', auth, cards);
app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// app.use(cookieParser({
//   secret: 'oleg-secrets',
//   secure: true,
//   httpOnly: true,
//   sameSite: 'none',
// }));

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
