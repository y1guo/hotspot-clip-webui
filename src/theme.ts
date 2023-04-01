import { createTheme } from "@mui/material/styles";

// create the light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
});

/// create the dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF8DCF",
    },
    secondary: {
      main: "#dc004e",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#202025",
      paper: "#121212",
    },
  },
});

export { lightTheme, darkTheme };
