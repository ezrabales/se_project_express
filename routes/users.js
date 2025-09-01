const express = require("express");
const { auth } = require("../middlewares/auth");

const router = express.Router();

const {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  createUser,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;
