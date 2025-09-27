const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");

const {
  castError,
  notFound,
  conflict,
  notAuthorized,
} = require("../utils/constants");

module.exports.logIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(castError).send({ message: "invalid email or password" });
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new BadRequestError("Incorrect Email or Password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new BadRequestError("Incorrect Email or Password"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).json({
          message: "Login successful",
          token,
        });
      });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new BadRequestError("User not found"));
    })
    .then((userData) => res.send(userData))
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!name || !avatar || !email || !password) {
      next(new BadRequestError("Name and Avatar are required"));
    }
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: await bcrypt.hash(password, 10),
    });
    const userObject = newUser.toJSON();
    delete userObject.password;

    return res.status(201).send(userObject);
  } catch (err) {
    if (err.code === 11000) {
      next(new BadRequestError("A user with this Email already exists"));
    }
    return next;
  }
};

module.exports.updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new BadRequestError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};
