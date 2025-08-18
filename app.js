const express = require("express");
const mongoose = require("mongoose");
const errors = require("./utils/constants");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = { _id: "68a0169278f04c2b144dc661" };
  next();
});

app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));

app.use((req, res) =>
  res.status(errors.notFound).send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
