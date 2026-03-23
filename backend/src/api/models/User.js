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
        required: [function () { return !this.googleId; }, 'La password è obbligatoria se non si usa Google'],
        minLength: 6
    },
    googleId: {
        type: String,
        sparse: true // Consente unicità con valori null.
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

    // Sotto-documento con attributi specifici per ruolo.
    profile: {
        // Campo applicabile al ruolo DONOR.
        donorType: {
            type: String,
            enum: ['PRIVATE', 'COMMERCIAL']
        },
        commercialHours: { // Indica gli orari operativi del donatore commerciale.
            type: String
        }
    },

    solidarityPoints: {
        type: Number,
        default: 0
    },

    // Riferimenti alle ricompense riscattate.
    redeemedRewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
    }]
}, {
    // Abilita i timestamp createdAt e updatedAt.
    timestamps: true
});

// Effettua hashing password prima del salvataggio quando necessario.
userSchema.pre('save', async function (next) {
    // Esegue hashing solo su password nuova o modificata.
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        // Applica hashing Argon2.
        const hash = await argon2.hash(this.password);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

// Confronta la password in chiaro con l'hash persistito.
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (err) {
        throw new Error(err);
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
