require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors({
  credentials: true,
  origin: [
    'https://markov.project.nomoreparties.sbs',
    'http://markov.project.nomoreparties.sbs',
    'https://api.markov.project.nomoredomains.work',
    'http://api.markov.project.nomoredomains.work',
    'https://praktikum.tk',
    'http://praktikum.tk',
    'https://localhost:3001',
    'https://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.enable('trust proxy');

app.use(express.json());

app.use(helmet());

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

app.use(cookieParser({
  secret: 'oleg-secrets',
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
