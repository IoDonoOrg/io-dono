// carica subito le variabili d'ambiente da .env
require('dotenv').config();

// importa l'app definita in app.js
const app = require('./app');

// legge la porta dal file .env, o usa 3000 di default
const PORT = process.env.PORT || 3000;

// avvia effettivamente il server e scrive a console il link
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
  console.log('Premi CTRL+C per terminare.');
});