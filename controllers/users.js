const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");

const {
  castError,
  notFound,
  conflict,
  notAuthorized,
} = require("../utils/constants");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.logIn = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(castError).send({ message: "invalid email or password" });
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) =>
      bcrypt.compare(password, user.password).then(() => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).json({
          message: "Login successful",
          token,
        });
      })
    )
    .catch((err) => {
      if (err.code === notAuthorized) {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
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
    if (err.name === "ValidationError") {
      return next(new BadRequestError("invalid data"));
    } else if (err.name === conflict) {
      return next(new ConflictError("email already exists"));
    }
    return next(err);
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("invalid data"));
      } else if (err.code === notFound) {
        next(new NotFoundError("user not found"));
      } else {
        next(err);
      }
    });
};
