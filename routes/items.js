const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.use("/:itemId/likes", require("./likes"));

router.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
