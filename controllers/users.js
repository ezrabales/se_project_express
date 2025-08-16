const user = require("../models/user");
const errorHandler = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => {
      if (!users) {
        return res.status(200).send({ data: [] });
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      errorHandler(err, "NotFound", res);
    });
};

module.exports.getUser = (req, res) => {
  user
    .findById(req.params.userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.status = 404;
      err.name = "NotFound";
      throw err;
    })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      errorHandler(err, "NotFound", res);
    });
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res.status(400).send({ error: "Name and avatar are required." });
    }
    const newUser = await user.create({ name, avatar });
    return res.status(201).send({ data: newUser });
  } catch (err) {
    errorHandler(err, "ValidationError", res);
  }
};
