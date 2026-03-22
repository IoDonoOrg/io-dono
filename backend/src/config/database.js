const mongoose = require('mongoose');
require('dotenv').config(); // Carica le variabili d'ambiente da .env.

const connectDB = async () => {
    try {
        // Legge la stringa di connessione MongoDB dalle variabili d'ambiente.
        const dbUri = process.env.MONGODB_URI;

        if (!dbUri) {
            console.error('ERRORE: MONGODB_URI non è definita nel file .env');
            process.exit(1); // Termina il processo in assenza di configurazione valida.
        }

        await mongoose.connect(dbUri);

        console.log('Connessione a MongoDB riuscita');
    } catch (err) {
        console.error('Errore durante la connessione a MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
