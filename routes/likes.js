const router = require("express").Router({ mergeParams: true });
const { likeItem, unlikeItem } = require("../controllers/likes");
const { auth } = require("../middlewares/auth");

router.put("/:itemId", auth, likeItem);
router.delete("/:itemId", auth, unlikeItem);

module.exports = router;
