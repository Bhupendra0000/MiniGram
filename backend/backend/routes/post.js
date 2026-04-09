const router = require("express").Router();
const Post = require("../models/post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
try {
  console.log("FILE:", req.file); 
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
  const post = await Post.create({
    text: req.body.text,
    image: imagePath, 
    username: req.user.username
  });

  res.json(post);
} catch (err) {
  console.error(err);
  res.status(500).json("Error creating post");
}
});

// router.get("/", async (req, res) => {
// const posts = await Post.find().sort({ createdAt: -1 });
// res.json(posts);
// });
router.get("/", async (req, res) => {
const page = parseInt(req.query.page) || 1;
const limit = 5;

const posts = await Post.find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

res.json(posts);
});

router.put("/like/:id", auth, async (req, res) => {
const post = await Post.findById(req.params.id);

if (!post.likes.includes(req.user.username)) {
  post.likes.push(req.user.username);
} else {
  post.likes = post.likes.filter(u => u !== req.user.username);
}
await post.save();
req.app.get("io").emit("update");

res.json(post);
});

router.put("/comment/:id", auth, async (req, res) => {
const post = await Post.findById(req.params.id);
post.comments.push({
  username: req.user.username,
  text: req.body.text
});

await post.save();
req.app.get("io").emit("update");
res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
try {
  const post = await Post.findById(req.params.id);

  if (post.username !== req.user.username) {
    return res.status(403).json("Not allowed");
  }
  await post.deleteOne();
  res.json("Post deleted");
} catch {
  res.status(500).json("Error");
}
});

module.exports = router;