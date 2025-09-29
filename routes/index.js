const router = express.Router();
const { logIn, createUser } = require("../controllers/users");

router.post("/signin", logIn);
router.post("/signup", createUser);

router.use("/users", require("../routes/users"));
router.use("/items", require("../routes/items"));
router.use("/likes", require("../routes/items"));
