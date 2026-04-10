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

export default function CreatePost({ refresh }) {
const [text, setText] = useState("");
const [file, setFile] = useState(null);
const fileRef = useRef();

const submit = async () => {
  if (!text && !file) return toast.error("Add text or image");

  const formData = new FormData();
  formData.append("text", text);
  if (file) formData.append("image", file);

  await api.post("/posts", formData);

  toast.success("Posted successfully");
  setText("");
  setFile(null);
  refresh();
};

return (
  <Paper
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 5,
      background: (theme) => theme.palette.background.paper
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
  style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
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

        <IconButton>
          <InsertEmoticon />
        </IconButton>
      </div>

      <Button variant="contained" onClick={submit}>
        Post
      </Button>
    </div>
  </Paper>
);
}