import { createBrowserRouter } from "react-router-dom";

import Example from "./pages/Example/Example";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";

// Definisce il router principale dell'app
// Ogni oggetto rappresenta una rotta con il suo percorso (path) e il componente da mostrare (element)
const router = createBrowserRouter([
  { path: "/", element: <Example /> },
  { path: "/example", element: <Example /> },
  { path: "/login", element: <Login /> },
  // { path: "/registration", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
