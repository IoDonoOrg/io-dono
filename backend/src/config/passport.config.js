const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Configura serializzazione e deserializzazione richieste da Passport.

// Mantiene il profilo utente in sessione con pass-through.
passport.serializeUser((user, done) => {
    // Propaga il profilo ricevuto dalla strategia Google.
    done(null, user);
});

// Ripristina il profilo dalla sessione con pass-through.
passport.deserializeUser((user, done) => {
    // Restituisce il profilo precedentemente serializzato.
    done(null, user);
});

passport.use(new GoogleStrategy({
    // Opzioni della strategia OAuth Google.
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Definisce la callback OAuth configurata su Google Cloud Console.
    callbackURL: '/api/auth/google/callback'
},
    (accessToken, refreshToken, profile, done) => {
        // Inoltra il profilo Google al controller applicativo.
        return done(null, profile); // Completa la fase di verifica della strategia.
    }
));