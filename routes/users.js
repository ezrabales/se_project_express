const express = require("express");
const { auth } = require("../middlewares/auth");

const router = express.Router();

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUpdateUser, auth, updateCurrentUser);

module.exports = router;
