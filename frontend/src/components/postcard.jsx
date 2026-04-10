import { useState } from "react";
import {
Card,
CardContent,
Typography,
Avatar,
IconButton,
TextField,
Button
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../api";

export default function PostCard({ post, like, refresh, currentUser }) {
const [comment, setComment] = useState("");

const addComment = async () => {
  if (!comment) return;

  try {
    await api.put(`/posts/comment/${post._id}`, { text: comment });
    setComment("");
    refresh();
  } catch (err) {
    console.error(err);
  }
};

const deletePost = async () => {
  try {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/posts/${post._id}`);
    refresh();
  } catch (err) {
    console.error(err);
  }
};

const sharePost = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied!");
};

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Math.floor((new Date() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  return Math.floor(diff / 3600) + " hr ago";
};

return (
  <Card sx={{ mb: 2, borderRadius: 4 }}>
    <CardContent>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar>
            {post?.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <div>
            <Typography fontWeight="bold">{post?.username}</Typography>
            <Typography variant="caption">
              {timeAgo(post?.createdAt)}
            </Typography>
          </div>
        </div>

        <Button size="small" variant="contained">
          Follow
        </Button>
      </div>

      <Typography sx={{ mt: 1 }}>{post?.text}</Typography>

      {post?.image && (
     <img
  src={`${process.env.REACT_APP_API_URL}${post.image}`}
  alt="post"
  style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
  onDoubleClick={() => like && like(post._id)}
/>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <IconButton onClick={() => like && like(post._id)}>
          <FavoriteIcon
            color={post?.likes?.includes(currentUser) ? "error" : "disabled"}
          />
        </IconButton>

        <Typography>{post?.likes?.length || 0}</Typography>

        <IconButton onClick={sharePost}>
          <ShareIcon />
        </IconButton>

        {post?.username === currentUser && (
          <IconButton onClick={deletePost}>
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </div>

      <Typography variant="body2" sx={{ mt: 1 }}>
        {post?.comments?.length || 0} comments
      </Typography>

      {post?.comments?.map((c, i) => (
        <Typography key={i} variant="body2">
          <b>{c.username}</b> {c.text}
        </Typography>
      ))}

      <TextField
        size="small"
        placeholder="Add comment..."
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addComment()}
        sx={{ mt: 1 }}
      />

    </CardContent>
  </Card>
);
}