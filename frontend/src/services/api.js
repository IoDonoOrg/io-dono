import axios from "axios";

// se l'app non è deployed => usa la variabile dell'ambiente
// altrimenti usa il percorso /api
const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_API
  : '/api';

// crea un'istanza di axios
const api = axios.create({
  // definire VITE_API_URL in un file .env per production build
  // altrimenti usera' url locale
  baseURL: baseURL,
  // timeout se il server non risponde
  timeout: 10000,
  // header comuni per tutte le chiamate
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// intercetta ogni richiesta mandata dal frontend e aggiunge l'authToken all'header
api.interceptors.request.use(
  (config) => {
    // legge il token dal localStorage
    const token = localStorage.getItem("authToken");

    // se il token esiste -> lo aggiunge all'header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;