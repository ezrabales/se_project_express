const { notFound, serverErr, castError } = require("./constants");

const errorHandler = (err, res) => {
  if (err.name === "CastError") {
    return res.status(castError).send({ message: "cast error" });
  }
  if (err.name === "NotFound") {
    return res.status(notFound).send({ message: "Item not found" });
  }
  if (err.name === "ValidationError") {
    return res.status(castError).send({ message: "Validation error" });
  }
  return res
    .status(serverErr)
    .send({ message: "An error has occurred on the server." });
};
module.exports = errorHandler;
