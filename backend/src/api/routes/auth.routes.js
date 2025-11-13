const express = require('express');
const router = express.Router();
const passport = require('passport'); // Necessario per le rotte Google
const authController = require('../controllers/auth.controller'); // import per il controller di riferimento
const { isAuth } = require('../../middleware/auth.middleware'); // import per eventuali middleware

// /api/auth/...

// Rotte di Registrazione e Login Locale 
// Queste rotte sono pubbliche. Chiunque può chiamarle.

router.post('/register', authController.register);

router.post('/login', authController.login);

// Rotte di Autenticazione Google 

// Rotta chiamata dal CLIENT per avviare il login Google
// Questo reindirizza l'utente alla pagina di consenso di Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // richiede a Google il profilo e l'email
        session: false // non usiamo sessioni
    })
);

// Rotta chiamata da GOOGLE dopo che l'utente ha dato il consenso
// Google reindirizza il pop-up a questo URL
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login', // Se l'utente annulla
        session: false 
    }),
    authController.handleGoogleCallback // Se l'autenticazione ha successo, esegui quest'altra funz
);

// Rotta chiamata da GOOGLE dopo che l'utente ha dato il consenso
// POST /api/auth/google/token
router.get('/google/token', authController.handleGoogleToken);

// Rotta chiamata dal CLIENT dopo il form di completamento
// Questa rotta  si aspetta il registrationToken
router.post('/register-google', authController.registerGoogle);


// --- Rotta di Test per l'Autenticazione ---
// Questa è una rotta protetta.
// Per testarla, dovrai prima fare il login, prendere il token,
// e poi fare una chiamata a questa rotta con l'header:
// Authorization: Bearer <il_tuo_token>

// GET /api/auth/me
router.get('/me',
    isAuth, // Esegui il middleware isAuth, per proteggere una rotta basta usare questa
    (req, res) => { // Se 'isAuth' ha successo...
        // ...'req.user' è ora disponibile grazie al middleware
        res.json({
            message: 'Sei autenticato con successo!',
            user: req.user
        });
    }
);


// una volta accertato il corretto funzionamento delle rotte rimuovere la vecchia rotta di test
router.get('/test', (req, res) => res.json({ message: 'auth routes funzionanti' }));

module.exports = router;