const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/items");
const { auth } = require("../middlewares/auth");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.patch("/:itemId", auth, toggleLike);

router.use("/:itemId/likes", require("./likes"));

module.exports = router;
