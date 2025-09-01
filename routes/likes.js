const router = require("express").Router({ mergeParams: true });
const { likeItem, unlikeItem } = require("../controllers/likes");
const { auth } = require("../middlewares/auth");

router.put("/", auth, likeItem);
router.delete("/", auth, unlikeItem);

module.exports = router;
