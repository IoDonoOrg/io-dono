import axios from "axios";

// crea un'istanza di axios
const api = axios.create({
  // definire VITE_API_URL in un file .env per production build
  // altrimenti usera' url locale
  baseURL: import.meta.env.VITE_BACKEND_API || "http://localhost:3000/api",
  // timeout se il server non risponde
  timeout: 10000,
  // header comuni per tutte le chiamate
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;