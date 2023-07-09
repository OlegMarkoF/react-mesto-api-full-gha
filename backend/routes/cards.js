const cardsRouter = require('express').Router();
const {
  validateId, validateCard,
} = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', validateCard, createCard);
cardsRouter.delete('/cards/:cardId', validateId, deleteCard);
cardsRouter.put('/cards/:cardId/likes', validateId, likeCard);
cardsRouter.delete('/cards/:cardId/likes', validateId, dislikeCard);

module.exports = cardsRouter;
