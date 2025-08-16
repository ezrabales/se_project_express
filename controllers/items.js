const item = require("../models/clothingItem");
const errorHandler = require("../utils/errors");

module.exports.getItems = (req, res) => {
  if (
    item.find().then((items) => {
      !items;
    })
  ) {
    return res.status(200).send({ message: "This database is empty" });
  }
  return item
    .find({})
    .orFail()
    .then((items) => res.send({ data: items }))
    .catch((err) => errorHandler(err, "ValidationError", res));
};

module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    if (!name || !weather || !imageUrl) {
      return res
        .status(400)
        .send({ error: "name, weather, and imageUrl are required." });
    }
    const newItem = await item.create({
      name,
      weather,
      imageUrl,
      owner: "68a0169278f04c2b144dc661",
    });
    return res.status(201).send({ data: newItem });
  } catch (err) {
    errorHandler(err, "ValidationError", res);
  }
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (!item.findById(itemId)) {
    res.status(404).send({ message: "Item not found" });
  }
  item
    .findByIdAndDelete(itemId)
    .orFail()
    .then((deletedItem) => {
      res
        .status(200)
        .send({ message: "Item successfully deleted", data: deletedItem });
    })

    .catch((err) => errorHandler(err, "ValidationError", res));
};
