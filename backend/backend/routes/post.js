const router = require("express").Router();
const Post = require("../models/post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const post = await Post.create({
      text: req.body.text,
      image: imagePath,
      username: req.user.username
    });

    res.json(post);
  } catch (err) {
    res.status(500).json("Error creating post");
  }
});


router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router; 