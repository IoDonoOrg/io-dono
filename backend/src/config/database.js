const mongoose = require('mongoose');
require('dotenv').config(); // Assicura che .env sia caricato

const connectDB = async () => {
    try {
        // prende la stringa di connessione dal file .env
        const dbUri = process.env.MONGODB_URI;

        if (!dbUri) {
            console.error('ERRORE: MONGODB_URI non è definita nel file .env');
            process.exit(1); // fallisce e mostra l'errore
        }

        await mongoose.connect(dbUri);
        
        console.log('Connessione a MongoDB riuscita');
    } catch (err) {
        console.error('Errore durante la connessione a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
