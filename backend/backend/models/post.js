const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
userId: String,
username: String,
text: String,
image: String,
likes: [String],
comments: [
  {
    username: String,
    text: String
  }
]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);