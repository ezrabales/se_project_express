const Item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");
const { castError, notFound, forbidden } = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

module.exports.createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!name || !weather || !imageUrl) {
      return res
        .status(castError)
        .send({ message: "name, weather, and imageUrl are required." });
    }
    const newItem = await Item.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    return res.status(201).send({ data: newItem });
  } catch (err) {
    return next(err);
  }
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(notFound).send({ message: "item not found" });
      }
      if (req.user._id !== item.owner.toString()) {
        return res.status(forbidden).send({ message: "Not authorized" });
      }
      return Item.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch(next);
};

module.exports.toggleLike = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const item = await Item.findById(itemId).orFail(() => {
      throw new BadRequestError("Item not found");
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
