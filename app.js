const express = require("express");
const mongoose = require("mongoose");
const { notFound } = require("./utils/constants");
const { logIn, createUser } = require("./controllers/users");
const cors = require("cors");

const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.post("/signin", logIn);
app.post("/signup", createUser);

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));

app.use((req, res) =>
  res.status(notFound).send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
