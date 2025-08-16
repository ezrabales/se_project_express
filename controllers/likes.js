const item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = "68a0169278f04c2b144dc661";
  item
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => errorHandler(err, "ValidationError", res));
};

module.exports.unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = "68a0169278f04c2b144dc661";
  item
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => errorHandler(err, "ValidationError", res));
};
