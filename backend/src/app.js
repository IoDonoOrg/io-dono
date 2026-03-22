const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logger.middleware.js');

require('dotenv').config();

const app = express();

// Abilita CORS per consentire richieste cross-origin dal frontend.
app.use(cors());

// Abilita il parsing automatico del body JSON.
app.use(express.json());

// Attiva il logger HTTP solo quando DEBUG è valorizzata.
if (process.env.DEBUG)
  app.use(logger);

// Importa il router principale delle API.
const apiRoutes = require('./api/routes/mainRouter.js');

// Monta tutte le API sotto il prefisso /api.
app.use('/api', apiRoutes);

// Calcola il path assoluto della build frontend.
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// Espone i file statici del frontend.
app.use(express.static(frontendDistPath));


// Reindirizza le rotte non API all'entrypoint della SPA.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

module.exports = app; // Esporta l'istanza Express per l'avvio del server.

