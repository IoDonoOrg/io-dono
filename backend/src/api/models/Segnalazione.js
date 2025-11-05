const mongoose = require('mongoose');

// per migliroare le query ho unificato le segnalazioni rispetto allo schema sotto consiglio del grande capo
const reportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    
    // se è una segnalazione su un utente
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // se è una segnalazione su una donazione
    donationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        default: null
    },

    type: { // enum per definire il tipo di problema
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
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN'
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
