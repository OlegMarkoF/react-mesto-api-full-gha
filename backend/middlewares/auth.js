const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;
  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  const token = Authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'oleg-secrets');
  } catch (err) {
    throw new UnauthorizedError('Переданы неверные данные');
  }
  req.user = payload;

  next();
};
