import { useState, useRef } from "react";
import {
Paper,
TextField,
Button,
Typography,
IconButton
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import InsertEmoticon from "@mui/icons-material/InsertEmoticon";
import api from "../api";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

export default function CreatePost({ refresh }) {
const [showEmoji, setShowEmoji] = useState(false);
const [text, setText] = useState("");
const [file, setFile] = useState(null);
const fileRef = useRef();

const onEmojiClick = (emojiData) => {
  setText((prev) => prev + emojiData.emoji);
};

const submit = async () => {
  if (!text && !file) return toast.error("Add text or image");

  try {
    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("image", file);

    await api.post("/posts", formData);

    toast.success("Posted successfully");

    setText("");
    setFile(null);
    setShowEmoji(false);
    refresh();
  } catch (err) {
    console.error(err);
    toast.error("Post failed");
  }
};

return (
  <Paper
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 5,
      position: "relative"
    }}
  >
    <Typography fontWeight="bold">Create Post</Typography>

    <TextField
      fullWidth
      variant="standard"
      placeholder="What's on your mind?"
      value={text}
      onChange={(e) => setText(e.target.value)}
      sx={{ mt: 2 }}
    />

    <input
      type="file"
      ref={fileRef}
      style={{ display: "none" }}
      onChange={(e) => setFile(e.target.files[0])}
    />

    {file && (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        style={{
          width: "100%",
          marginTop: 10,
          borderRadius: 10
        }}
      />
    )}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10
      }}
    >
      <div>
        <IconButton onClick={() => fileRef.current.click()}>
          <PhotoCamera />
        </IconButton>

        <IconButton onClick={() => setShowEmoji(!showEmoji)}>
          <InsertEmoticon />
        </IconButton>
      </div>

      <Button variant="contained" onClick={submit}>
        Post
      </Button>
    </div>

    {showEmoji && (
      <div style={{ marginTop: 10 }}>
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </div>
    )}
  </Paper>
);
}