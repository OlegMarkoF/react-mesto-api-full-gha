require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
// const cors = require('./middlewares/cors');
const cors = require('cors');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./utils/NotFoundError');
const auth = require('./middlewares/auth');
const {
  validateUser, validateLogin,
} = require('./middlewares/validation');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser({
  secret: 'oleg-secrets',
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}));
// app.use('*', cors());
app.use('*', cors({
  credentials: true,
  origin: [
    'https://api.markov.project.nomoredomains.work',
    'http://api.markov.project.nomoredomains.work',
    'https://markov.project.nomoreparties.sbs',
    'http://markov.project.nomoreparties.sbs',
    'https://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3001',
    'http://localhost:3001',
    'localhost:3000',
  ],
}));

app.enable('trust proxy');
app.use(rateLimit);
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use('/users', auth, userRoute);
app.use('/cards', auth, cardRoute);
app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
