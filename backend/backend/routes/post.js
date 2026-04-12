const router = require("express").Router();
const Post = require("../models/post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
try {
  console.log("FILE:", req.file);
  console.log("BODY:", req.body);

  const imagePath = req.file ? req.file.path : "";

  const post = await Post.create({
    text: req.body.text,
    image: imagePath,
    username: req.user.username,
    likes: [],
    comments: []
  });

  res.json(post);
} catch (err) {
  console.log("POST ERROR:", err); 
  res.status(500).json("Error creating post");
}
});

router.get("/", async (req, res) => {
const posts = await Post.find().sort({ createdAt: -1 });
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
res.json(post);
});

router.put("/comment/:id", auth, async (req, res) => {
const post = await Post.findById(req.params.id);

post.comments.push({
  username: req.user.username,
  text: req.body.text
});

await post.save();
res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
const post = await Post.findById(req.params.id);

if (post.username !== req.user.username) {
  return res.status(403).json("Not allowed");
}

await post.deleteOne();
res.json("Deleted");
});

module.exports = router;