const mongoose = require('mongoose');

// ho midificato l'inventario in modo che su ogni riga ci sia una articolo storato dall'associazione in modo da poter già inserire tutti gli articoli
const inventoryItemSchema = new mongoose.Schema({
    associationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    itemType: { 
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: { 
        type: String,
        required: true
    },
    storageLocation: { 
        type: String
    }
}, {
    timestamps: true
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
module.exports = InventoryItem;
