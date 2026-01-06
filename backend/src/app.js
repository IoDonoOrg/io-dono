const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logger.middleware.js');

require('dotenv').config();

const app = express();

// Abilita CORS per tutte le richieste e origini
// altrimenti server frontend non può fare delle chiamate al backend
app.use(cors());

// Middleware per leggere il JSON nei body delle richieste
app.use(express.json());

// Middleware per loggare ogni richiesta che arriva al server 
// abilitato tramite la variabile d'ambiente DEBUG nel file .env
if (process.env.DEBUG)
  app.use(logger);

// Importa il "super-router" dalla cartella routes
const apiRoutes = require('./api/routes/mainRouter.js');

// Rotta api standard che usa apiRoutes che non è altro che il mainRouter 
// usare use e non get per gestire tutti i tipi di richiesta
app.use('/api', apiRoutes);

// path assoluti
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// fa partire il servizio di frontend
app.use(express.static(frontendDistPath));


// Gestione delle rotte per il frontend 
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

module.exports = app; // Esporta l'app per usarla in server.js

