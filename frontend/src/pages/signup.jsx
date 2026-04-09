import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function Signup() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const signup = async () => {
    if (!data.username || !data.email || !data.password) {
      return toast.error("All fields required");
    }
    try {
      await api.post("/auth/signup", data);
      toast.success("Signup successful ");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5">Signup</Typography>

        <TextField
          label="Username"
          fullWidth
          sx={{ mt: 2 }}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />

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
        <Button variant="contained" sx={{ mt: 2 }} onClick={signup}>
          Signup
        </Button>

        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}