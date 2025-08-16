const errors = [
  {
    code: 400,
    message: "Invalid request",
  },
  {
    code: 404,
    message: "Data not found",
  },
];

const errorHandler = (err, errorName, res) => {
  for (let i = 0; i < errors.length; i++) {
    if ((err.name = errorName)) {
      return res.status(errors[i].code).send({ message: err.message });
    } else {
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    }
  }
};
module.exports = errorHandler;
