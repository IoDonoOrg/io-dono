const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PUBLIC_ALLOWED_ROLES = ['DONOR'];

const normalizeRole = (value) => String(value || '').toUpperCase();

// Utility per la generazione dei token JWT.
const generateToken = (user) => {
    // Definisce payload di login con identificativo e ruolo utente.
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
    // Costruisce payload temporaneo per completamento registrazione Google.
    const payload = {
        ...googlePayload,
        type: 'registration'
    };
    return jwt.sign(
        payload, // Include i dati Google necessari al completamento registrazione.
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Applica scadenza breve al token temporaneo.
    );
}

// Registra un utente locale.
exports.registerUser = async (req, res) => {
    try {
        const { email, password, name, role, phoneNumber, address, profile } = req.body;
        const normalizedRole = normalizeRole(role || 'DONOR');

        if (!PUBLIC_ALLOWED_ROLES.includes(normalizedRole)) {
            return res.status(403).json({ message: 'Ruolo non consentito per registrazione pubblica.' });
        }

        // Verifica unicità email.
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già in uso.' });
        }

        // Crea il nuovo utente; l'hash password viene gestito dal model hook.
        const newUser = new User({
            email,
            password,
            name,
            role: normalizedRole,
            phoneNumber,
            address,
            profile // Include attributi specifici del profilo.
        });

        // Salva il documento utente.
        await newUser.save();

        // Genera token di login.
        const token = generateToken(newUser);

        // Rimuove il campo password dalla risposta.
        newUser.password = undefined;

        res.status(201).json({ token, user: newUser });

    } catch (error) {
        // Gestisce gli errori di validazione Mongoose.
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Crea una sessione locale (login email/password).
exports.createSession = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Recupera utente per email.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Blocca login locale per account nati da OAuth Google.
        if (!user.password) {
            return res.status(401).json({ message: 'Questo account è registrato con Google. Prova ad accedere con Google.' });
        }

        // Verifica corrispondenza password.
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Genera token di sessione.
        const token = generateToken(user);

        // Rimuove il campo password dalla risposta.
        user.password = undefined;

        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Scambia token/profilo Google con token applicativo.
exports.exchangeGoogleToken = async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        let googleId;
        let email;
        let name;
        let picture;

        // Gestisce token ID inviato dal frontend.
        if (req.body && req.body.token) {
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            googleId = payload.sub;
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        }

        // Gestisce callback Passport con profilo Google già validato.
        if (!googleId && req.user) {
            googleId = req.user.id;
            email = req.user.emails && req.user.emails[0] ? req.user.emails[0].value : undefined;
            name = req.user.displayName;
            picture = req.user.photos && req.user.photos[0] ? req.user.photos[0].value : undefined;
        }

        if (!googleId || !email) {
            return res.status(400).json({ message: 'Token/profilo Google mancante o non valido.' });
        }

        // Esegue login se l'utente Google risulta già registrato.
        let user = await User.findOne({ googleId });

        if (user) {
            // Genera token di accesso standard.
            const loginToken = generateToken(user); // Riutilizza utility di generazione token.

            user.password = undefined;
            return res.status(200).json({ loginToken: loginToken, user });
        }

        // Verifica assenza di conflitto su email prima della preregistrazione.
        let existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: `L'email ${email} è già registrata. Accedi con la tua password e collega l'account Google dal tuo profilo.`
            });
        }

        // Costruisce payload per token temporaneo di registrazione.
        const registrationPayload = {
            googleId,
            email,
            name,
            picture,
        };

        // Genera token di registrazione con validità breve.
        const registrationToken = generateRegistrationToken(registrationPayload);

        // Restituisce token temporaneo per il completamento registrazione.
        return res.status(201).json({ registrationToken });

    } catch (error) {
        // Gestisce errori di validazione token Google.
        console.error("Errore verifica token Google:", error);
        return res.status(401).json({ message: 'Token Google non valido o scaduto', error: error.message });
    }
};

// Completa la registrazione utente proveniente da Google.
exports.registerGoogleUser = async (req, res) => {

    // Estrae il token di registrazione dall'header Authorization.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token di registrazione mancante o non valido.' });
    }
    const registrationToken = authHeader.split(' ')[1];

    // Estrae i dati aggiuntivi dal body.
    const { role, phoneNumber, address, profile } = req.body;
    const normalizedRole = normalizeRole(role || 'DONOR');

    // Verifica la presenza dei campi obbligatori.
    if (!role || !phoneNumber || !address) {
        return res.status(400).json({ message: 'Dati di registrazione incompleti (ruolo, telefono, indirizzo).' });
    }

    if (!PUBLIC_ALLOWED_ROLES.includes(normalizedRole)) {
        return res.status(403).json({ message: 'Ruolo non consentito per registrazione pubblica.' });
    }

    try {
        // Verifica e decodifica il token di registrazione.
        const decodedPayload = jwt.verify(registrationToken, process.env.JWT_SECRET);

        // Convalida la tipologia del token.
        if (decodedPayload.type !== 'registration') {
            return res.status(401).json({ message: 'Token non valido per questa operazione.' });
        }

        // Estrae i dati Google dal payload decodificato.
        const { googleId, email, name } = decodedPayload;

        // Riesegue il controllo di unicità utente.
        let existingUser = await User.findOne({ $or: [{ googleId }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Questo utente o email esiste già.' });
        }

        // Crea il nuovo utente combinando payload Google e body applicativo.
        const newUser = new User({
            googleId,
            email,
            name,
            role: normalizedRole,
            phoneNumber,
            address,
            profile
        });

        // Salva il nuovo utente.
        await newUser.save();

        // Genera token di login definitivo.
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


// Restituisce l'utente autenticato corrente (usato da GET /auth/me)
exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autenticato.' });
        }
        return res.status(200).json({ message: 'Sei autenticato con successo!', user: req.user });
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};
