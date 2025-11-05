const mongoose = require('mongoose');


const pickupPointSchema = new mongoose.Schema({
    associationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    name: {
        type: String,
        required: true
    },
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
    },
    openingHours: { // potrebe servire
        type: String 
    }
}, {
    timestamps: true
});

pickupPointSchema.index({ geo: '2dsphere' });

const PickupPoint = mongoose.model('PickupPoint', pickupPointSchema);
module.exports = PickupPoint;
