const { Router } = require("express");
const authMiddleware=require('../Middleware/authMiddleWare')
const router = Router();
const {
  registerUser,
  loginUser,
  getAuthors,
  getUser,
  editUser,
  changeAvator,
} = require("../controllers/useControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.get("/", getAuthors);
router.post("/change-avator",authMiddleware, changeAvator);
router.patch("/edit-user",authMiddleware, editUser);

module.exports = router;
