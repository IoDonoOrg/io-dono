const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'L\'email è obbligatoria'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [function() { return !this.googleId; }, 'La password è obbligatoria se non si usa Google'],
        minLength: 6
    },
    googleId: {
        type: String,
        sparse: true // Per permettere 'unique' ma anche valori nulli
    },
    role: {
        type: String,
        required: true,
        enum: ['DONOR', 'ASSOCIATION', 'ADMIN'],
        default: 'DONOR'
    },
    name: {
        type: String,
        required: [true, 'Il nome è obbligatorio']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Il numero di telefono è obbligatorio']
    },
    address: {
        type: String,
        required: [true, 'L\'indirizzo è obbligatorio']
    },
    
    // Sotto-documento per dati specifici del ruolo
    profile: {
        // Se role === 'DONOR'
        donorType: {
            type: String,
            enum: ['PRIVATE', 'COMMERCIAL']
        },
        commercialHours: { // Orari per donatori 'COMMERCIAL' tipo bar o ristoranti
            type: String
        }
    },
    
    solidarityPoints: {
        type: Number,
        default: 0
    },
    
    // FK alle ricompense 
    redeemedRewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }]
}, {
    // Aggiunge createdAt e updatedAt automaticamente
    timestamps: true
});

// Hook di Mongoose, sostanzialmente prima di salvare fa questo codice ovvero l'hashing della password
userSchema.pre('save', async function(next) {
    // Esegui l'hashing solo se la password è stata modificata (o è nuova)
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        // Hasha la password con Argon2
        const hash = await argon2.hash(this.password);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

// Metodo per confrontare la password (inutile se non implementiamo questo tipo di login)
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (err) {
        throw new Error(err);
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
