const express = require('express');
const router = express.Router();
const passport = require('passport'); // Gestisce il flusso OAuth con Google.
const authController = require('../controllers/auth.controller'); // Espone i metodi del dominio auth.
const { isAuth } = require('../../middleware/auth.middleware'); // Verifica autenticazione JWT.

// Espone la creazione utente locale.
router.post('/users', authController.registerUser);

// Espone la creazione token locale (login).
router.post('/tokens', authController.createSession);

// Espone le rotte OAuth Google.

// Avvia il consenso OAuth su Google.
router.get('/google/authorize',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // Richiede dati profilo ed email.
        session: false // Disabilita sessioni applicative.
    })
);

// Riceve la callback OAuth dopo il consenso utente.
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login', // Reindirizza in caso di annullamento o errore.
        session: false
    }),
    authController.exchangeGoogleToken // Completa lo scambio token/profilo.
);

// Scambia token Google con token applicativo o token di registrazione.
router.post('/google/sessions', authController.exchangeGoogleToken);

// Completa la registrazione di un utente Google.
router.post('/google/users', authController.registerGoogleUser);

// Restituisce l'utente autenticato corrente (canonical: /me)
router.get('/me', isAuth, authController.getCurrentUser);

// NOTE: deprecated `/sessions` routes removed to keep API RESTful.
module.exports = router;