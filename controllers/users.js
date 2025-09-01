const user = require("../models/user");
const errorHandler = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  castError,
  notFound,
  conflict,
  notAuthorized,
} = require("../utils/constants");

module.exports.logIn = (req, res) => {
  const { email, password } = req.body;
  return user
    .findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(notFound)
          .send({ message: "incorrect email or password" });
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(notFound)
            .send({ message: "incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).json({
          message: "Login successful",
          token: token,
        });
      });
    })
    .catch((err) => errorHandler(err, res));
};

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
};

module.exports.getCurrentUser = (req, res) => {
  user
    .findById(req.user._id)
    .orFail(() => {
      const err = new Error("User not found");
      err.status = notFound;
      err.name = "NotFound";
      throw err;
    })
    .then((userData) =>
      res.send({
        _id: userData._id,
        email: userData.email,
      })
    )
    .catch((err) => {
      errorHandler(err, res);
    });
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!name || !avatar || !email || !password) {
      return res
        .status(castError)
        .send({ message: "Name and avatar are required." });
    }
    const newUser = await user.create({
      name,
      avatar,
      email,
      password: await bcrypt.hash(password, 10),
    });
    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).send({ data: newUser, token: token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(conflict).send({
        message: "A user with this email already exists",
      });
    }
    return errorHandler(err, res);
  }
};

module.exports.updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  user
    .findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => errorHandler(err, res));
};
