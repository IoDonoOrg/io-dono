const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // FK ad un User 
        required: true
    },
    associationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // FK ad un user associazione  
        default: null
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
        default: 'AVAILABLE'
    },
    type: { // cibo o vestiti
        type: String,
        required: true
    },
    quantity: { 
        type: String,
        required: true
    },
    pickupTime: { 
        type: Date,
        required: true
    },
    notes: {
        type: String
    },
    
    // sotto-documento per la localizzazione, da capire sopratutto per quanto riguarano le api google
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
            coordinates: { // Formato [longitudine, latitudine]
                type: [Number],
                required: true
            }
        }
    },

    // sotto-documento per la valutazione 
    evaluation: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }
}, {
    timestamps: true
});

// Indice per le query geospaziali, sostanzialmente permette di fare query super veloci perchè mongodb già sa gestire le coordinate spaziali
// tipo senza fare calcoli matematici si possono chiedere tutti i punti entro 5km da me 
donationSchema.index({ 'pickupLocation.geo': '2dsphere' });

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
