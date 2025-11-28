import { Box, CircularProgress } from "@mui/material";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";

// il componente che wrappa le rotte protette e controlla se l'utente sia autenticato o meno
// se lo è -> gli permette di accedere alle risorse protette
// altrimenti lo manda alla pagina login
function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log("loading");
    return;
  }

  // controlla se l'utente è autenticato
  return user ? (
    <Outlet />
  ) : (
    // state prop memorizza la rotta che un utente non autenticato ha tentato di accedere
    // per poter tornarci dopo l'autenticazione
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
