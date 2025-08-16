const errorHandler = (err, errorName, res) => {
  if (err.name === errorName) {
    return res.status(err.status).send({ message: err.message });
  }
  return res
    .status(500)
    .send({ message: "An error has occurred on the server." });
};
module.exports = errorHandler;
