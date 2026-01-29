import { createBrowserRouter } from "react-router-dom";

import Example from "./pages/Example.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Registration from "./pages/Registration.jsx";
import Home from "./pages/Home.jsx";
import RequireAuth from "./context/RequireAuth.jsx";

// Definisce il router principale dell'app
// Ogni oggetto rappresenta una rotta con il suo percorso (path) e il componente da mostrare (element)
const router = createBrowserRouter([
  // --- ROTTE PUBBLICHE ---
  { path: "/login", element: <Login /> },
  { path: "/registration", element: <Registration /> },
  { path: "/example", element: <Example /> },

  // --- ROTTE PROTETTE ---
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/prot",
        element: <Example />,
      },
      // altre rotte protette vengono aggiunte qua
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
