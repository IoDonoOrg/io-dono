import { jwtDecode } from "jwt-decode";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";

// il componente che wrappa le rotte protette e controlla se l'utente sia autenticato o meno
// controlla anche il token JWT dell'utente
//
// se l'utente è già autenticato -> gli permette di accedere alle risorse protette
// altrimenti lo manda alla pagina login
function RequireAuth() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  const token = localStorage.getItem("authToken");

  // verifica se il token del utente non sia ancora scaduto
  // se lo è reindirizza l'utente al login
  if (isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // controlla se l'utente è autenticato
  // se lo è gli permette di accedere ad una rotta protetta
  return user ? (
    <Outlet />
  ) : (
    // altrimenti l'utente viene reindirizzato alla pagina di login
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// una funzione helper che prende un token cifrato e verifica se sia scaduto
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // in secondi
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    // in millisecondi
    const currentTime = Date.now();

    // * 1000 per converire JWT in millisecondi
    if (decodedToken.exp * 1000 < currentTime) {
      console.log("Token scaduto. Reindirizzamento al login..");
      return true;
    }

    return false;
    // token sformatato viene considerato come scaduto
  } catch (error) {
    console.log(error);
    return true;
  }
};

export default RequireAuth;
