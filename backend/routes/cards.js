const router = require('express').Router();
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

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/likes/:cardId', validateId, likeCard);
router.delete('/likes/:cardId', validateId, dislikeCard);

module.exports = router;
