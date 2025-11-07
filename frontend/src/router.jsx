import { createBrowserRouter } from "react-router-dom";

import App from "./pages/App/App";
import Example from "./pages/Example/Example";

// Definisce il router principale dell'app
// Ogni oggetto rappresenta una rotta con il suo percorso (path) e il componente da mostrare (element)
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/example", element: <Example /> },
]);

export default router;