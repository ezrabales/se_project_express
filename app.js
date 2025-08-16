const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.req.user = {
  _id: "68a0169278f04c2b144dc661",
};

app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
