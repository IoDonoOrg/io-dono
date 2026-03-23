const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Riferimento all'utente donatore.
        required: true
    },
    associationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Riferimento all'utente associazione.
        default: null
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
        default: 'AVAILABLE'
    },
    items: [{
        type: {
            type: String,
            required: [true, 'Il tipo di oggetto è obbligatorio']
        },
        name: {
            type: String,
            required: [true, 'Il nome/descrizione dell\'oggetto è obbligatorio']
        },
        quantity: {
            type: String,
            required: [true, 'La quantità è obbligatoria']
        }
    }],
    pickupTime: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    },

    // Sotto-documento per indirizzo e coordinate del ritiro.
    pickupLocation: {
        address: {
            type: String,
            required: true
        },
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: { // Formato coordinate [longitudine, latitudine].
                type: [Number],
                required: true
            }
        }
    },

    // Sotto-documento per la valutazione della donazione.
    evaluation: {
        rating: { type: Number, min: 1, max: 10 },
        comment: { type: String }
    }
}, {
    timestamps: true
});

// Definisce indice geospaziale per ricerche efficienti su coordinate.
donationSchema.index({ 'pickupLocation.geo': '2dsphere' });

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
