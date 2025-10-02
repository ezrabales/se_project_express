const jwt = require("jsonwebtoken");
const { notAuthorized } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.code === notAuthorized) {
      next(new UnauthorizedError("authorization required"));
    } else {
      next(err);
    }
  }

  req.user = payload;

  return next();
};
