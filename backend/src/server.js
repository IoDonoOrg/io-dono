// carica subito le variabili d'ambiente da .env
require('dotenv').config();

// importa l'app definita in app.js
const app = require('./app');

// per il db
const connectDB = require('./config/database');

// legge la porta dal file .env, o usa 3000 di default
const PORT = process.env.PORT || 3000;

// avvia effettivamente il server e scrive a console il link
const startServer = async () => {
    try {
        // connessione al db
        await connectDB();
        
        console.log('Database connesso con successo.');

        // avvia il server
        app.listen(PORT, () => {
            console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
            console.log('Premi CTRL+C per terminare.');
        });

    } catch (error) {
        // Se 'connectDB()' fallisce 
        console.error('Impossibile connettersi al database.');
        console.error(error.message); 
        
        // Esce dal processo con un codice di errore.
        // Non ha senso avviare un server che non può parlare col suo database.
        process.exit(1); 
    }
};

// 6. Esegui la funzione di avvio
startServer();