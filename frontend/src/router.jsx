import { createBrowserRouter } from "react-router-dom";

import Example from "./pages/Example/Example";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Registration from "./pages/Registration/Registration";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home/Home";

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
