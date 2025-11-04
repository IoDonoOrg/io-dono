const express = require('express');
const app = express();

// Middleware per leggere il JSON nei body delle richieste
app.use(express.json());

// Rotta api standard
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Ciao Mondo!' });
});

module.exports = app; // Esporta l'app per usarla in server.js