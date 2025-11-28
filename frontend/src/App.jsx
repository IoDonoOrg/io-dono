import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";

import theme from "src/utils/materialUITheme.js";
import { ThemeProvider } from "@mui/material/styles";

import { RouterProvider } from "react-router-dom";
import router from "src/router.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthProvider";

// --- Entry point del frontend ---
// RouterProvider fornisce le rotte dell'applicazione (più dettagli nel file src/router.jsx)
// AuthProvider salve l'utente nel contesto globale per l'autenticazione
// ThemeProvider wrapper di materialui, permette di definire una theme unificata (dettagli: src/utils/materialUITheme)
// GoogleOAuthProvider componente per l'autenticazione google, permette di usare il button "login con google"

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
