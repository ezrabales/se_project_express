const { errors } = require("./constants");

const errorHandler = (err, errorName, res) => {
  if (err.name === "CastError") {
    return res.status(errors.castError).send({ message: "Invalid ID format" });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(errors.notFound).send({ message: "Item not found" });
  }
  if (err.name === "ValidationError") {
    return res
      .status(errors.validationError)
      .send({ message: "Validation error" });
  }
  return res
    .status(errors.serverErr)
    .send({ message: "An error has occurred on the server." });
};
module.exports = errorHandler;
