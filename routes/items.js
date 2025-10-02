const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/items");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateItem,
  validatorGetById,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validatorCreateItem, auth, createItem);
router.delete("/:itemId", validatorGetById, auth, deleteItem);
router.patch("/:itemId", validatorGetById, auth, toggleLike);

module.exports = router;
