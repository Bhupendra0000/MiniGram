import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Feed from "./pages/feed";
import Profile from "./pages/profile";
import Navbar from "./components/navbar";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "./theme"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
const [token, setToken] = useState(localStorage.getItem("token"));
const [dark, setDark] = useState(false);

useEffect(() => {
  const handleStorage = () => {
    setToken(localStorage.getItem("token"));
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}, []);

return (
  <ThemeProvider theme={getTheme(dark)}>
    <BrowserRouter>
      {token && (
        <Navbar setToken={setToken} dark={dark} setDark={setDark} />
      )}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route
          path="/"
          element={token ? <Feed /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={
            !token ? <Login setToken={setToken} /> : <Navigate to="/" />
          }
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

    </BrowserRouter>
  </ThemeProvider>
);
}

export default App;