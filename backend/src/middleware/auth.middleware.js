const jwt = require('jsonwebtoken');
const User = require('../api/models/User');
require('dotenv').config(); 
// Questo file conterrà gli Express Middleware

// Middleware 1: Controlla se l'utente è loggato verificando il JWT
exports.isAuth = async (req, res, next) => {
    
    // 1. Estrarre il token
    const authHeader = req.headers.authorization;

    // Se l'header non esiste o non inizia con "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Autorizzazione richiesta. Token mancante o formato non valido.' });
    }

    const token = authHeader.split(' ')[1]; // Prende solo il token

    try {
        // 2. Verificare il token
        // Questo decodifica il token e controlla la firma (e la scadenza)
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Il payload è { userId: '...', role: '...' }

        // 3. Allegare l'utente
        // Troviamo l'utente nel DB usando l'ID del token
        // .select('-password') esclude la password (anche se hashata) dalla query
        const user = await User.findById(payload.userId).select('-password'); 

        if (!user) {
            // Se l'utente non esiste più nel DB (es. account eliminato)
            return res.status(401).json({ message: 'Utente non trovato.' });
        }

        // Allega l'oggetto utente alla richiesta
        req.user = user;
        
        // Fatto! Passa al prossimo middleware o al controller
        next(); 

    } catch (error) {
        // Se jwt.verify fallisce (token scaduto, firma non valida)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token scaduto. Effettua di nuovo il login.' });
        }
        return res.status(401).json({ message: 'Token non valido.' });
    }
};

// Middleware 2: Controlla se l'utente è un Donatore
exports.isDonor = (req, res, next) => {
    // Questo middleware si aspetta che 'isAuth' sia stato eseguito prima

    if (req.user && req.user.role === 'DONOR') {
        next();
    } else {
         res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Donatore.' });
    }
    next(); // serve per dire ad express che può procedere e che il middleware ha finito
};

// Middleware 3: Controlla se l'utente è un'Associazione
exports.isAssociation = (req, res, next) => {
    if (req.user && req.user.role === 'ASSOCIATION') {
        next();
    } else {
        res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Associazione.' });
    }
    console.log('Controllo isAssociation: Per ora, passo...');
    next(); // serve per dire ad express che può procedere e che il middleware ha finito
};

// Middleware 4: Controlla se l'utente è un Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Accesso negato. Richiesto ruolo Admin.' });
    }
    console.log('Controllo isAdmin: Per ora, passo...');
    next(); // serve per dire ad express che può procedere e che il middleware ha finito
};