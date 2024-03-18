const { Router } = require("express");
const router = Router();
const {
  getCatPosts,
  getPost,
  getPosts,
  getUserPosts,
  deletePost,
  editPost,
  createPost,
} = require("../controllers/postControllers");
const authMiddleware = require("../Middleware/authMiddleWare");
router.post("/", authMiddleware,createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCatPosts);
router.get("/users/:id", getUserPosts);
router.patch("/:id",authMiddleware, editPost);
router.delete("/:id",authMiddleware, deletePost);

module.exports = router;
