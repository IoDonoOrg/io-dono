const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();



// Funzioni Helper per creare Token 
const generateToken = (user) => {
    // Creiamo un token JWT che contiene l'ID e il ruolo dell'utente
    // Scadrà in 3 ore (puoi cambiarlo)
    const payload = {
        id: user._id,
        role: user.role, 
        type: 'login'
    };
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    );
};

function generateRegistrationToken(googlePayload) {
    // googlePayload contiene { googleId, email, name, picture } e in più il tipo
    const payload = {
        ...googlePayload, 
        type: 'registration' 
    };
    return jwt.sign(
        payload, // Inseriamo tutti i dati di Google
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Scadenza molto breve!
    );
}

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

// nuova logica google
// Logica per: POST /api/auth/google/token
exports.handleGoogleToken = async (req, res) => {

    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!token) {
        return res.status(400).json({ message: 'Token Google (credential) mancante.' });
    }

    try {
        // Verifica il token (credential) usando la libreria Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specifica il Client ID
        });

        // Estrai i dati dell'utente dal token verificato
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Controlla se l'utente esiste già (LOGIN)
        let user = await User.findOne({ googleId });

        if (user) {
            // Utente trovato quindi genera un token di accesso standard.
            const loginToken = generateToken(user); // La tua funzione generateToken(user)
            
            user.password = undefined; 
            return res.status(200).json({ loginToken: loginToken, user });
        }

        // Utente NON trovato 

        // Controllo di sicurezza
        let existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                message: `L'email ${email} è già registrata. Accedi con la tua password e collega l'account Google dal tuo profilo.` 
            });
        }
        
        // Crea il payload per il token di registrazione temporaneo
        const registrationPayload = {
            googleId,
            email,
            name,
        };
        
        // Generiamo il token di registrazione di 15 min
        const registrationToken = generateRegistrationToken(registrationPayload); 
        
        // Invia al client questo token temporaneo per il completamento della registrazione
        return res.status(201).json({ registrationToken });

    } catch (error) {
        // Se la verifica fallisce (token scaduto, audience non valida, ecc.)
        console.error("Errore verifica token Google:", error);
        return res.status(401).json({ message: 'Token Google non valido o scaduto', error: error.message });
    }
};

// Logica registrazione Google 
// Logica per: POST /api/auth/register-google
exports.registerGoogle = async (req, res) => {

    // estrae il token di registrazione dall'header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token di registrazione mancante o non valido.' });
    }
    const registrationToken = authHeader.split(' ')[1];

    // estrae i nuovi dati dal body
    const { role, phoneNumber, address, profile } = req.body;

    // Controllo di sicurezza: assicurati che i nuovi campi ci siano
    if (!role || !phoneNumber || !address) {
        return res.status(400).json({ message: 'Dati di registrazione incompleti (ruolo, telefono, indirizzo).' });
    }
    
    try {
        // Verifica il token di registrazione
        const decodedPayload = jwt.verify(registrationToken, process.env.JWT_SECRET);
        
        // verifica che sia un token di "registrazione"
        if (decodedPayload.type !== 'registration') {
            return res.status(401).json({ message: 'Token non valido per questa operazione.' });
        }

        // estrai i dati di Google DAL TOKEN
        const { googleId, email, name } = decodedPayload;

        // controlla di nuovo se l'utente esiste (controllo di sicurezza)
        let existingUser = await User.findOne({ $or: [{ googleId }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Questo utente o email esiste già.' });
        }

        // crea il nuovo utente (combinando i dati del token e del body)
        const newUser = new User({
            googleId,
            email,
            name,
            role,          // Dal body
            phoneNumber,   // Dal body
            address,       // Dal body
            profile        // Dal body
        });

        // Salva l'utente
        await newUser.save();

        // Crea un VERO token di login 
        const loginToken = generateToken(newUser);
        
        newUser.password = undefined; 
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