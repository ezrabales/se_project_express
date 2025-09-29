require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound } = require("./utils/constants");
const { errorHandler } = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
app.use(cors());
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);
app.use(express.json());

// remove this after review passes
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
// remove this after review passes

app.use("/", require("./routes"));

app.use((req, res) =>
  res.status(notFound).send({ message: "Requested resource not found" })
);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
