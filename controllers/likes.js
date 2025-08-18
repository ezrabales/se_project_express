const item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  item
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "NotFound";
      throw err;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => {
      if (err.name) {
        return errorHandler(err, err.name, res);
      }
      return console.error(err);
    });
};

module.exports.unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  item
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "NotFound";
      throw err;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => {
      if (err.name) {
        return errorHandler(err, err.name, res);
      }
      return console.error(err);
    });
};
