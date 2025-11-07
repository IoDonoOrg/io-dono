import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // permette di scrivere percorsi assoluti per le cartelle dentro src
  // prima: "../../assets/react.svg"
  // ora: "src/assets/react.svg"
  resolve: {
    alias: {
      src: "/src",
    },
  },
})
