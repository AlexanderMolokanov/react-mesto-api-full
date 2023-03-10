const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequest = require('../errors/BadRequest'); // 400

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    await card.populate(['owner', 'likes']);
    res.send(card);
  } catch (err) {
    if (err.name === 'BadRequest' || err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card) {
      const isOwner = req.user._id === card.owner.toString();
      if (!isOwner) throw new ForbiddenError('Вы не являетесь владельцем карточки');
      await Card.findByIdAndDelete(req.params.cardId);
      res.send({ message: 'Карточка удалена' });
    } else throw new NotFoundError('Карточка не найдена');
  } catch (err) {
    if (err.name === 'BadRequest' || err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card) {
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true, runValidators: true },
      );
      await updatedCard.populate(['owner', 'likes']);
      res.send(updatedCard);
    } else throw new NotFoundError('Карточка не найдена');
  } catch (err) {
    if (err.name === 'BadRequest' || err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card) {
      const updatedCard = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true, runValidators: true },
      );
      await updatedCard.populate(['owner', 'likes']);
      res.send(updatedCard);
    } else throw new NotFoundError('Карточка не найдена');
  } catch (err) {
    if (err.name === 'BadRequest' || err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
