const router = require("express").Router({ mergeParams: true });
const { likeItem, unlikeItem } = require("../controllers/likes");

router.put("/", likeItem);
router.delete("/", unlikeItem);

router.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
