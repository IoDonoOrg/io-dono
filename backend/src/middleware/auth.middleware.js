// Questo file conterrà gli Express Middleware

// Middleware 1: Controlla se l'utente è loggato verificando il JWT
exports.isAuth = (req, res, next) => {
    // qui ci va la logica per a verifica del JWT

    // Se il token fosse valido, deve troare l'utente e metterlo nel req.user
    next(); // serve per dire ad express che può procedere e che il middleware ha finito
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