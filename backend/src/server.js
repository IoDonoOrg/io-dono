// Carica le variabili d'ambiente da file .env.
require('dotenv').config();

// Importa l'app Express.
const app = require('./app');

// Importa la funzione di connessione al database.
const connectDB = require('./config/database');

// Legge la porta dal file .env con fallback a 3000.
const PORT = process.env.PORT || 3000;

// Avvia la connessione al DB e successivamente il server HTTP.
const startServer = async () => {
    try {
        // Stabilisce la connessione al database.
        await connectDB();

        console.log('Database connesso con successo.');

        // Avvia il listener HTTP.
        app.listen(PORT, () => {
            console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
            console.log('Premi CTRL+C per terminare.');
        });

    } catch (error) {
        // Gestisce il fallimento della connessione al database.
        console.error('Impossibile connettersi al database.');
        console.error(error.message);

        // Termina il processo con codice di errore.
        process.exit(1);
    }
};

// Esegue la procedura di avvio.
startServer();