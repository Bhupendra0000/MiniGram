import { useEffect, useState, useCallback } from "react";
import api from "../api";
import PostCard from "../components/postcard";

export default function Profile() {
const [posts, setPosts] = useState([]);
const user = JSON.parse(localStorage.getItem("user"));
const fetchPosts = useCallback(async () => {
  const res = await api.get("/posts");
  const myPosts = res.data.filter(p => p.username === user.username);
  setPosts(myPosts);
}, [user.username]);

useEffect(() => {
  fetchPosts();
}, [fetchPosts]);


const like = async (id) => {
  await api.put(`/posts/like/${id}`);
  fetchPosts(); 
};

return (
  <div
    style={{
      maxWidth: 500,
      margin: "auto",
      width: "100%",
      padding: 10
    }}
  >
    <h2>{user.username}'s Profile</h2>

    {posts.map(p => (
      <PostCard
        key={p._id}
        post={p}
        like={like}                
        refresh={fetchPosts}
        currentUser={user.username}
      />
    ))}
  </div>
);
}