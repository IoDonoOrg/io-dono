const jwt = require('jsonwebtoken');
const User = require('../api/models/User');
require('dotenv').config();

// Verifica autenticazione JWT e carica l'utente su req.user.
exports.isAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Autorizzazione richiesta. Token mancante o formato non valido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto. Effettua di nuovo il login.' });
        }
        return res.status(401).json({ message: 'Token non valido.' });
    }
};

// Verifica il ruolo DONOR.
exports.isDonor = (req, res, next) => {
    if (req.user && req.user.role === 'DONOR') {
        return next();
    }
    return res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Donatore.' });
};

// Verifica il ruolo ASSOCIATION.
exports.isAssociation = (req, res, next) => {
    if (req.user && req.user.role === 'ASSOCIATION') {
        return next();
    }
    return res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Associazione.' });
};

// Verifica il ruolo ADMIN.
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Admin.' });
};