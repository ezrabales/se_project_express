const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Avatar must be a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "must be valid Email",
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
