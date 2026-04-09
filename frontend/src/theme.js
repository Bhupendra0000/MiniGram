import { createTheme } from "@mui/material/styles";

const getTheme = (dark) =>
createTheme({
  palette: {
    mode: dark ? "dark" : "light",
    background: {
      default: dark ? "#121212" : "#fafafa"
    }
  }
});

export default getTheme;