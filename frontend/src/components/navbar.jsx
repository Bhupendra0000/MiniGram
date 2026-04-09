import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
export default function Navbar({ setToken, dark, setDark }) { 
const user = JSON.parse(localStorage.getItem("user"));
const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
setToken(null);
};
return (
<AppBar
  position="sticky"
  // sx={{
  //   background: "#fff",
  //   color: "#000",
  //   boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  // }}
  sx={{
background: (theme) => theme.palette.background.paper,
color: (theme) => theme.palette.text.primary,
boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
}}
>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="h6" fontWeight="bold">
      MiniGram
    </Typography>

    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

      <Link to="/" style={{ textDecoration: "none" }}>
        <Button color="inherit" startIcon={<HomeIcon />}>
          Home
        </Button>
      </Link>

      <Link to="/profile" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
      <Typography fontWeight="bold" sx={{ color: "#000" }}>
            {user?.username}
          </Typography>
        </div>
      </Link>

    <IconButton
onClick={() => {
localStorage.setItem("dark", JSON.stringify(!dark));
setDark(!dark);
}}
>
{dark ? <LightModeIcon /> : <DarkModeIcon />}
</IconButton>
      <Button color="inherit" onClick={logout}>
        Logout
      </Button>

    </div>
  </Toolbar>
</AppBar>
);
}