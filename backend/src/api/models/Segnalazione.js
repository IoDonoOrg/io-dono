const mongoose = require('mongoose');

// Definisce uno schema unico per la gestione delle segnalazioni.
const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Identifica l'utente segnalato, se presente.
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Identifica la donazione segnalata, se presente.
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        default: null
    },

    type: { // Classifica la tipologia della segnalazione.
        type: String,
        enum: ['MALFUNCTION', 'USER_BEHAVIOR'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
