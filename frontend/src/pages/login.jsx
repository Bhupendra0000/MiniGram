import { useState } from "react";
import {
TextField,
Button,
Container,
Paper,
Typography
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
export default function Login({ setToken }) {
const [data, setData] = useState({ email: "", password: "" });

const navigate = useNavigate(); 
const login = async () => {
  if (!data.email || !data.password) {
    return toast.error("Please fill all fields");
  }

  try {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setToken(res.data.token);

    toast.success("Login successful ");

    navigate("/profile"); 

  } catch (err) {
    toast.error(err.response?.data?.msg || "Login failed");
  }
};

return (
  <Container maxWidth="sm">
    <Paper sx={{ p: 4, mt: 10 }}>
      <Typography variant="h5">Login</Typography>

      <TextField
        label="Email"
        fullWidth
        sx={{ mt: 2 }}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ mt: 2 }}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={login}>
        Login
      </Button>
      <Typography sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Signup
        </Link>
      </Typography>
    </Paper>
  </Container>
);
}