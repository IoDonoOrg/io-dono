import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // permette di scrivere percorsi assoluti per le cartelle dentro src
  // prima: "../../assets/react.svg"
  // ora: "src/assets/react.svg"
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 5000,
  },
})
