const bcrypt = require("bcrypt");
const Item = require("../models/clothingItem");
const { notFound, forbidden } = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

module.exports.createItem = async (req, res, next) => {
  const { name, avatar, password, email } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => Item.create({ name, avatar, email, password: hash }))
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.code === 1100) {
        next(new ConflictError("Duplicate email error"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      if (err.code === notFound) {
        next(new NotFoundError("item not found"));
      } else if (err.code === forbidden) {
        next(new UnauthorizedError("Not Authorized"));
      } else {
        next(err);
      }
    });
};

module.exports.toggleLike = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  try {
    const item = await Item.findById(itemId).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    const isLiked = item.likes.includes(userId);
    const updateOperation = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedItem = await Item.findByIdAndUpdate(itemId, updateOperation, {
      new: true,
    });

    res.status(200).send({ data: updatedItem });
  } catch (error) {
    next(error);
  }
};
