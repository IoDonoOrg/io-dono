import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import theme from "src/utils/materialUITheme.js";
import { ThemeProvider } from "@mui/material/styles";

import { RouterProvider } from "react-router-dom";
import router from "src/router.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

// entry point del frontend
// RouterProvider e un componente speciale di React che
// leggere l'URL nel browser per mostrare la pagine corretta
// in base alla configurazione definita in router.jsx

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
