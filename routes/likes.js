const router = require("express").Router({ mergeParams: true });
const { likeItem, unlikeItem } = require("../controllers/likes");

router.put("/", likeItem);
router.delete("/", unlikeItem);

module.exports = router;
