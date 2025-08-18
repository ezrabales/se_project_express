const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.use("/:itemId/likes", require("./likes"));

module.exports = router;
