const Item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");
const { castError } = require("../utils/constants");
const { notAuthorized } = require("../utils/constants");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => errorHandler(err, res));
};

module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!name || !weather || !imageUrl) {
      return res
        .status(castError)
        .send({ message: "name, weather, and imageUrl are required." });
    }
    const newItem = await item.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    return res.status(201).send({ data: newItem });
  } catch (err) {
    return errorHandler(err, res);
  }
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (req.user._id !== Item.findById(itemId).owner) {
    res.status(notAuthorized).send({ message: "not authorized" });
  }
  return Item.findByIdAndDelete(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "NotFound";
      throw err;
    })
    .then((deletedItem) =>
      res.send({
        message: "Item successfully deleted",
        data: deletedItem,
      })
    )
    .catch((err) => errorHandler(err, res));
};
