const express = require("express");
const router = express.Router();
const { logIn, createUser } = require("../controllers/users");

router.post("/signin", logIn);
router.post("/signup", createUser);

router.use("/users", require("./users"));
router.use("/items", require("./items"));
router.use("/likes", require("./items"));

module.exports = router;
