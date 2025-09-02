const express = require("express");
const { auth } = require("../middlewares/auth");

const router = express.Router();

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;
