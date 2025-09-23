const Item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");
const BadRequestError = require("../errors/BadRequestError");

module.exports.likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      next(new BadRequestError("Item not found"));
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch(next);
};

module.exports.unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      next(new BadRequestError("Item not found"));
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch(next);
};
