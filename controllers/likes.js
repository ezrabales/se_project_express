const Item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");

module.exports.likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "NotFound";
      throw err;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => errorHandler(err, res));
};

module.exports.unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "NotFound";
      throw err;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => errorHandler(err, res));
};
