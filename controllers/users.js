const user = require("../models/user");
const errorHandler = require("../utils/errors");
const { castError, notFound } = require("../utils/constants");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.status = notFound;
      err.name = "NotFound";
      throw err;
    })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res
        .status(castError)
        .send({ message: "Name and avatar are required." });
    }
    const newUser = await user.create({ name, avatar });
    return res.status(201).send({ data: newUser });
  } catch (err) {
    return errorHandler(err, res);
  }
};
