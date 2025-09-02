const Item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");
const { castError, notFound, notAuthorized } = require("../utils/constants");

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
    const newItem = await Item.create({
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
  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(notFound).send({ message: "item not found" });
      }
      if (req.user._id !== item.owner.toString()) {
        return res.status(notAuthorized).send({ message: "Not authorized" });
      }
      return Item.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((err) => errorHandler(err, res));
};
