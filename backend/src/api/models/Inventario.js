const mongoose = require('mongoose');

// Modella l'inventario come righe articolo legate all'associazione proprietaria.
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
