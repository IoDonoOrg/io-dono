const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Passport ha bisogno di "serializzare" e "deserializzare" gli utenti
// per gestire le sessioni. ANCHE SE USIAMO JWT (stateless),
// questa configurazione base è necessaria per far funzionare
// il middleware passport.authenticate().

// Salva l'ID dell'utente nella sessione (in questo caso, un "pass-through")
passport.serializeUser((user, done) => {
    // 'user' qui è il "profilo" che passiamo da Google
    // Passiamo l'intero profilo al prossimo step
    done(null, user); 
});

// Recupera l'utente dalla sessione (in questo caso, un "pass-through")
passport.deserializeUser((user, done) => {
    // 'user' è il profilo che abbiamo salvato
    done(null, user);
});

passport.use(new GoogleStrategy({
    // Opzioni per la strategia Google
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Questo è l'URL a cui Google reindizzerà il browser
    // DOPO che l'utente ha dato il consenso.
    // Deve corrispondere a quello nella tua Google Cloud Console.
    callbackURL: '/api/auth/google/callback' 
},
(accessToken, refreshToken, profile, done) => {
    // Questa è la funzione "verify". Viene chiamata DOPO
    // che passport ha parlato con Google.
    
    // NON cerchiamo l'utente qui.
    // Passiamo l'intero profilo Google al nostro controller
    // che gestirà la logica "Login O Inizia Registrazione".
    return done(null, profile); // segnala che ha finito e può passare al prossimo passo
}
));