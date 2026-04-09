import { useEffect, useState } from "react";
import api from "../api";
import { io } from "socket.io-client";
import CreatePost from "../components/createpost";
import PostCard from "../components/postcard";
import { Button, Typography } from "@mui/material";

const socket = io("http://localhost:5000");

export default function Feed() {
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));

const fetchPosts = async (pageNo = 1, reset = false) => {
  try {
    setLoading(true);

    const res = await api.get(`/posts?page=${pageNo}`);

    if (res.data.length === 0) {
      setHasMore(false);
    }

    if (reset) {
      setPosts(res.data);
      setHasMore(true);
    } else {
      setPosts((prev) => {
        const newPosts = res.data.filter(
          (p) => !prev.some((old) => old._id === p._id)
        );
        return [...prev, ...newPosts];
      });
    }

    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};

useEffect(() => {
  fetchPosts(page);
}, [page]);

useEffect(() => {
  const handleUpdate = () => {
    setPage(1);
    fetchPosts(1, true);
  };

  socket.on("update", handleUpdate);
  return () => socket.off("update", handleUpdate);
}, []);

const like = async (id) => {
  try {
    await api.put(`/posts/like/${id}`);
  } catch (err) {
    console.error(err);
  }
};

return (
  <div style={{ background: "#fafafa", minHeight: "100vh", padding: 10 }}>
    <div style={{ maxWidth: 500, margin: "auto", width: "100%" }}>

      <CreatePost
        refresh={() => {
          setPage(1);
          fetchPosts(1, true);
        }}
      />

      {posts.length === 0 && !loading && (
        <Typography align="center" sx={{ mt: 3 }}>
          No posts yet 
        </Typography>
      )}

      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      )}

      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          like={like}
          refresh={() => {
            setPage(1);
            fetchPosts(1, true);
          }}
          currentUser={user?.username}
        />
      ))}

      {!loading &&
        (hasMore ? (
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </Button>
        ) : (
          <Typography align="center" sx={{ mt: 2 }}>
            No more posts 🚫
          </Typography>
        ))}

    </div>
  </div>
);
}