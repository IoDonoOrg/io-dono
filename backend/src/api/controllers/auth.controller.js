const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/*

{
    "email": "test-utente-3@example.com",
    "password": "pass123",
    "name": "Test Utente tre",
    "role": "DONOR",
    "phoneNumber": "123456789",
    "address": "Via Roma 1",
    "profile": {
        "donorType": "PRIVATE"
    }
}

{
    "email": "test-utente-3@example.com",
    "password": "pass123"
}

*/

// --- Funzione Helper per creare Token ---
const generateToken = (user) => {
    // Creiamo un token JWT che contiene l'ID e il ruolo dell'utente
    // Scadrà in 3 ore (puoi cambiarlo)
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    );
};

// --- Registrazione Locale (Email/Password) ---
// Logica per: POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { email, password, name, role, phoneNumber, address, profile } = req.body;

        // 1. Controlla se l'utente esiste già
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già in uso.' });
        }

        // 2. Crea il nuovo utente
        // Nota: non serve hashare la password qui
        // L'hook 'pre-save' nel file user.model.js lo farà automaticamente
        const newUser = new User({
            email,
            password,
            name,
            role,
            phoneNumber,
            address,
            profile // Contiene donorType, ecc.
        });
        
        // 3. Salva l'utente 
        await newUser.save();

        // 4. Crea un token per il login automatico
        const token = generateToken(newUser);

        // 5. Rimuovi la password prima di inviare la risposta
        newUser.password = undefined;

        res.status(201).json({ token, user: newUser });

    } catch (error) {
        // Gestisce gli errori di validazione di Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// --- Login Locale (Email/Password) ---
// Logica per: POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Trova l'utente
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // 2. Se l'utente si è registrato con Google, non ha password
        if (!user.password) {
            return res.status(401).json({ message: 'Questo account è registrato con Google. Prova ad accedere con Google.' });
        }

        // 3. Confronta la password
        // Usiamo il metodo .comparePassword() che abbiamo definito in user.model.js
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // 4. Crea un token
        const token = generateToken(user);

        // 5. Rimuovi la password prima di inviare la risposta
        user.password = undefined;

        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// vecchia logica Google
// Logica per: GET /api/auth/google/callback
exports.handleGoogleCallback = async (req, res) => {
    // Se arriviamo qui, Passport ha funzionato.
    // Il profilo Google è in req.user (grazie alla nostra config passport)
    const googleProfile = req.user;

    try {
        const googleId = googleProfile.id;
        const email = googleProfile.emails[0].value;
        const name = googleProfile.displayName;

        // 1. Controlla se l'utente esiste già (LOGIN)
        let user = await User.findOne({ googleId });

        if (user) {
            // Utente trovato! Genera un token e fa il login.
            const token = generateToken(user);

            // Per le SPA: reindirizziamo a una pagina "ponte" del frontend
            // che chiuderà il pop-up e salverà il token.
            // Esempio: http://tuo-frontend.com/auth-success?token=...
            // Per ora, inviamo il token. Il client dovrà gestirlo.
            // Una soluzione più pulita è inviare uno script che fa postMessage
            return res.status(200).send(`
                <script>
                    window.opener.postMessage({ token: "${token}", user: ${JSON.stringify(user)} }, 'http://localhost:3000'); // Assumendo che il frontend sia su porta 3000
                    window.close();
                </script>
            `);
        }

        // 2. Utente NON trovato (INIZIO REGISTRAZIONE)
        
        // Creiamo un payload per il token temporaneo.
        const registrationPayload = {
            googleId,
            email,
            name
        };
        
        // Generiamo il token di registrazione (valido 15 min)
        const registrationToken = generateRegistrationToken(registrationPayload);
        
        // Invia al client questo token temporaneo.
        // Il client lo userà per completare la registrazione.
        return res.status(200).send(`
            <script>
                window.opener.postMessage({ registrationToken: "${registrationToken}" }, 'http://localhost:3000');
                window.close();
            </script>
        `);

    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'autenticazione Google', error: error.message });
    }
};

// nuova logica google
// Logica per: POST /api/auth/google/token
exports.handleGoogleToken = async (req, res) => {
    // 1. Estrai il token (credential) inviato dal frontend
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!token) {
        return res.status(400).json({ message: 'Token Google (credential) mancante.' });
    }

    try {
        // 2. Verifica il token (credential) usando la libreria Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specifica il Client ID
        });

        // 3. Estrai i dati dell'utente dal token verificato
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // 4. Controlla se l'utente esiste già (LOGIN)
        let user = await User.findOne({ googleId });

        if (user) {
            // ===> LOGIN
            // Utente trovato! Genera un token di accesso standard.
            const loginToken = generateToken(user); // La tua funzione generateToken(user)
            
            user.password = undefined; // Non inviare mai l'hash
            return res.status(200).json({ token: loginToken, user });
        }

        // 5. Utente NON trovato (INIZIO REGISTRAZIONE)

        // Controllo di sicurezza: l'email è già usata da un account non-google?
        let existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                message: `L'email ${email} è già registrata. Accedi con la tua password e collega l'account Google dal tuo profilo.` 
            });
        }
        
        // 6. Crea il payload per il token di registrazione temporaneo
        const registrationPayload = {
            googleId,
            email,
            name,
            picture // Puoi aggiungere 'picture' se vuoi salvarla
        };
        
        // Generiamo il token di registrazione (es. 15 min)
        const registrationToken = generateRegistrationToken(registrationPayload); // La tua funzione
        
        // ===> REGISTRAZIONE PARZIALE
        // Invia al client questo token temporaneo.
        // Il client lo userà per completare la registrazione (Step 2).
        return res.status(200).json({ registrationToken });

    } catch (error) {
        // Se la verifica fallisce (token scaduto, audience non valida, ecc.)
        console.error("Errore verifica token Google:", error);
        return res.status(401).json({ message: 'Token Google non valido o scaduto', error: error.message });
    }
};

// --- Logica Google (Step 2 - Registrazione) ---
// Logica per: POST /api/auth/register-google
exports.registerGoogle = async (req, res) => {

    // 1. Estrai il token di registrazione dall'header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token di registrazione mancante o non valido.' });
    }
    const registrationToken = authHeader.split(' ')[1];

    // 2. Estrai i nuovi dati dal body
    const { role, phoneNumber, address, profile } = req.body;

    // Controllo di sicurezza: assicurati che i nuovi campi ci siano
    if (!role || !phoneNumber || !address) {
        return res.status(400).json({ message: 'Dati di registrazione incompleti (ruolo, telefono, indirizzo).' });
    }
    
    try {
        // 3. Verifica il token di registrazione
        const decodedPayload = jwt.verify(registrationToken, process.env.JWT_SECRET);
        
        // 4. Estrai i dati di Google DAL TOKEN
        const { googleId, email, name } = decodedPayload;

        // 5. Controlla di nuovo se l'utente esiste (controllo di sicurezza)
        let existingUser = await User.findOne({ $or: [{ googleId }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Questo utente o email esiste già.' });
        }

        // 6. Crea il nuovo utente (combinando i dati del token e del body)
        const newUser = new User({
            googleId,
            email,
            name,
            role,          // Dal body
            phoneNumber,   // Dal body
            address,       // Dal body
            profile        // Dal body
        });

        // 7. Salva l'utente
        await newUser.save();

        // 8. Crea un VERO token di login (valido 3 ore)
        const loginToken = generateToken(newUser);
        
        newUser.password = undefined; // Pulizia
        res.status(201).json({ token: loginToken, user: newUser });

    } catch (error) {
         if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ message: 'Token di registrazione non valido o scaduto. Riprova il login.' });
         }
         if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};