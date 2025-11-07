import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import router from "src/router.jsx";

// entry point del frontend
// RouterProvider e un componente speciale di React che 
// leggere l'URL nel browser per mostrare la pagine corretta
// in base alla configurazione definita in router.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
