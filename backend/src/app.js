const express = require('express');
const app = express();

// Middleware per leggere il JSON nei body delle richieste
app.use(express.json());

// Importa il "super-router" dalla cartella routes
const apiRoutes = require('./api/routes/mainRouter.js');

// Rotta api standard che usa apiRoutes che non è altro che il mainRouter 
// usare use e non get per gestire tutti i tipi di richiesta
app.use('/api', apiRoutes);

module.exports = app; // Esporta l'app per usarla in server.js