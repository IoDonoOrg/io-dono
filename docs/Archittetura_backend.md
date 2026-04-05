## Dipendenze Principali

* **`express`**: Il framework web per Node.js. Lo usiamo per creare e gestire tutti gli endpoint della nostra API (es. `/api/donations`, `/api/login`).
* **`mongoose`**: Un "Object Data Modeler" (ODM) per MongoDB. Ci permette di definire schemi (come `userSchema`, `donationSchema`) e interagire con il database in modo semplice e strutturato.
* **`dotenv`**: Carica le variabili d'ambiente da un file `.env` nel processo. Fondamentale per tenere segrete le chiavi API, le stringhe di connessione al DB e i segreti JWT.
* **`argon2`**: Una funzione di hashing (criptaggio) moderna e sicura. La usiamo per criptare le password degli utenti prima di salvarle nel database, rendendole illeggibili.
* **`jsonwebtoken`**: Usato per creare e verificare i JSON Web Tokens (JWT). È il cuore del nostro sistema di autenticazione: dopo il login, l'utente riceve un token per "dimostrare" chi è nelle richieste successive.
* **`passport`**: Un middleware di autenticazione per Express. È un "motore" che gestisce le strategie di login.
* **`passport-google-oauth20`**: Una strategia specifica per Passport che ci permette di implementare il "Login con Google" (SSO).

## Architettura del Backend e Workflow

Questa sezione spiega l'architettura del progetto e il flusso di lavoro standard per aggiungere nuove funzionalità.

### 1. La Filosofia: Separazione dei Compiti (SoC)

La struttura delle cartelle è progettata per seguire il principio della [Separation of Concerns](https://www.google.com/search?q=https://it.wikipedia.org/wiki/Separazione_delle_competenze "null"). Ogni parte del codice ha una sola responsabilità. Questo rende il codice più pulito, più facile da testare e più semplice da manutenere.

Ecco il ruolo di ogni cartella in `src/`:

* `/src/config/`
  * **Cosa fa:** Contiene i file di configurazione.
  * **Esempio:** `database.js` (per connettersi a MongoDB), `passport.js` (per configurare la strategia di login con Google e JWT).
* `/src/api/models/`
  * **Cosa fa:** Definisce gli **Schemi** del nostro database. È la "forma" dei nostri dati su MongoDB.
  * **Modelli implementati:**
    - `User.js` - Schema utenti (DONOR, ASSOCIATION, ADMIN) con campi ban audit trail (isBanned, bannedAt, bannedReason, bannedBy)
    - `Donazione.js` - Schema donazioni con items array, pickup location geo, stato transizionale
    - `Segnalazione.js` - Schema segnalazioni con audit trail (resolution, closedAt, closedBy)
    - `Ricompensa.js` - Schema ricompense con lifecycle management (isActive, expiresAt, maxRedemptions, pointsCost opzionale)
    - `Notification.js` - Schema notifiche in-app con tipi predefiniti (DONATION_ACCEPTED, DONATION_COMPLETED, REWARD_ACTIVATED, SYSTEM)
    - `RewardClaim.js` - Schema attivazioni reward con codice univoco e status transizionale
    - `Inventario.js` - (stub) Per futuri inventari associazioni
    - `PuntoDiRitiro.js` - (stub) Per futuri punti di ritiro
* `/src/api/controllers/`
  * **Cosa fa:** È il **cervello** dell'applicazione. Contiene la logica di business. Prende una richiesta (request), usa i "Modelli" per interagire con il DB e invia una risposta (response).
  * **Controller implementati:**
    - `auth.controller.js` - Registrazione (con role hardening: solo DONOR pubblico), login, Google OAuth flow
    - `donation.controller.js` - CRUD completo + transizioni stato (ACCEPTED, COMPLETED) con trigger notifiche e transazioni ACID
    - `report.controller.js` - CRUD segnalazioni + chiusura con audit trail
    - `notification.controller.js` - Listaggio con filtri (page, limit, isRead, type), PATCH singola e bulk
    - `reward.controller.js` - Listaggio ricompense disponibili, claim activation transazionale, state transitions
    - `admin.controller.js` - Creazione utenti associazione, ban/unban con audit, statistiche overview/trend/filtrate
    - `associationReport.controller.js` - Report settimanale (ultimi 7 giorni) e itemizzato per range date
* `/src/api/routes/`
  * **Cosa fa:** Definisce gli **endpoint** (gli URL) della nostra API e li collega ai "Controller".
  * **Route file disponibili:**
    - `auth.routes.js` - `/auth/users` (POST reg), `/auth/sessions` (POST login), `/auth/google/*` (OAuth)
    - `donation.routes.js` - `/donations` (POST create, GET list, GET/:id detail, PATCH/:id update, DELETE/:id)
    - `report.routes.js` - `/reports` (POST create, GET list, GET/:id, PATCH/:id solo admin con isAdmin middleware)
    - `notification.routes.js` - `/me/notifications` (GET list+filter, PATCH bulk, PATCH/:id single)
    - `reward.routes.js` - `/rewards` (GET list available rewards)
    - `rewardClaim.routes.js` - `/me/rewards/claims` (GET list, POST activate transazionale, PATCH/:claimId state)
    - `admin.routes.js` - `/admin/users` (POST create assoc, PATCH/:id ban/unban), `/admin/statistics/*` (overview/trend/filtrate)
    - `association.routes.js` - `/associations/reports/*` (GET weekly, GET items range-based)
    - `mainRouter.js` - Compose tutti i route file e monta su `/api` prefix
* `/src/middleware/`
  * **Cosa fa:** È il **"buttafuori"** (security) della nostra API. Sono funzioni che vengono eseguite *prima* del controller per verificare i permessi.
  * **Middleware implementati:**
    - `auth.middleware.js` - `isAuth` (verifica JWT + check isBanned), `isDonor`, `isAssociation`, `isAdmin`
    - `logger.middleware.js` - Logging richieste HTTP basic (in development)
* `/src/utils/`
  * **Cosa fa:** Contiene funzioni "utility" condivise tra controller per evitare duplicazione.
  * **Utility disponibili:**
    - `statistics.utils.js` - `parseQuantityNumber()`, `parseDateInput()`, `validateObjectId()`, `getDateRange()` con default logic (30 giorni)
    - (Future) `ApiError.js` per standardizzare errori
    - (Future) `logger.js` per logging strutturato
* `/src/app.js`
  * **Cosa fa:** È il **cuore** di Express. Carica i middleware principali (come `express.json()`) e "collega" tutti i file delle rotte da `/src/api/routes/`.
* `/src/server.js`
  * **Cosa fa:** È il  **punto d'avvio** . Il suo unico scopo è (1) caricare le variabili `.env`, (2) connettersi al Database e (3) avviare il server facendolo ascoltare sulla porta definita.

### 2. Workflow: Come Aggiungere una Nuova Funzionalità

Segui sempre questi passaggi. Esempio:  **"Creare la Registrazione Utente" (`POST /api/auth/register`)** .

#### Passo 0: Connessione al Database (Si fa una sola volta)

1. **File:** `src/config/database.js`
2. **Azione:** Scrivi la funzione `connectDB()` che usa Mongoose per connettersi al tuo database Atlas (userai una variabile `DB_URI` dal file `.env`).
3. **File:** `src/server.js`
4. **Azione:** Importa e chiama `connectDB()` *prima* di `app.listen()`.

#### Passo 1: Definire i Dati (Model)

1. **File:** `src/api/models/User.js` (naming convention: PascalCase per i modelli)
2. **Azione:** Usa Mongoose per creare uno `userSchema` con tutti i campi che abbiamo definito (email, password, role, name, ecc.). Ricorda di usare `argon2` per "hashare" la password *prima* di salvarla (usando un `pre-save hook` di Mongoose).
3. **Azione:** `module.exports = mongoose.model('User', userSchema);`

#### Passo 2: Scrivere la Logica (Controller)

1. **File:** `src/api/controllers/auth.controller.js`
2. **Azione:** Scrivi la funzione `register = async (req, res) => { ... }`.
3. **Logica:**
   * Prendi `email`, `password`, `name`, `role` da `req.body`.
   * Controlla se l'email esiste già (`await User.findOne({ email })`). Se sì, invia un errore 400.
   * Crea un nuovo utente: `const user = new User({ email, password, name, role })`. (L'hash della password avverrà in automatico grazie al Passo 1).
   * Salva l'utente: `await user.save()`.
   * Crea un JWT (JSON Web Token) per il nuovo utente.
   * Invia la risposta: `res.status(201).json({ token, user })`.

#### Passo 3: Creare l'Endpoint (Route)

1. **File:** `src/api/routes/auth.routes.js`
2. **Azione:** Importa il controller e definisci la rotta.
   ```javascript
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/auth.controller');

   // POST /api/auth/users (registrazione)
   router.post('/users', authController.registerUser);

   // POST /api/auth/sessions (login)
   router.post('/sessions', authController.createSession);

   // Aggiungeremo qui /google/*, ecc.

   module.exports = router;
   ```

#### Passo 4: Collegare le Rotte (App.js e mainRouter.js)

1. **File:** `src/api/routes/mainRouter.js`
2. **Azione:** "Collega" il file delle rotte all'app principale combinando tutte le rotte. Aggiungi queste righe:
   ```javascript
   const express = require('express');
   const router = express.Router();

   const authRoutes = require('./auth.routes');
   const donationRoutes = require('./donation.routes');
   const reportRoutes = require('./report.routes');
   // ... altri route file

   // Monta le rotte sotto i prefissi semantici
   router.use('/auth', authRoutes);
   router.use('/donations', donationRoutes);
   router.use('/reports', reportRoutes);
   // ... etc

   module.exports = router;
   ```

3. **File:** `src/app.js`
4. **Azione:** Monta il mainRouter:
   ```javascript
   const mainRouter = require('./api/routes/mainRouter');
   app.use('/api', mainRouter);
   ```

Ora, se avvii il server (`npm start`) e invii una richiesta `POST` a `http://localhost:3000/api/auth/register` con i dati giusti, il tuo utente verrà creato nel database.

## struttura DB (Tipo ER)

## API RESTful (Refactor Marzo 2026)

### Donations (`/api/donations`)

* `POST /api/donations` — crea donazione (solo `DONOR`)
* `GET /api/donations` — lista con filtri via query:
  * `DONOR`: solo proprie donazioni (`status` opzionale)
  * `ASSOCIATION`: `AVAILABLE` globali, `ACCEPTED`/`COMPLETED` solo proprie
  * `ADMIN`: visione completa con filtri `status`, `donorId`, `associationId`
* `GET /api/donations/:id` — dettaglio singolo con controllo accessi
* `PATCH /api/donations/:id` — update parziale:
  * donatore proprietario: modifica campi se `AVAILABLE`
  * associazione: transizioni stato (`ACCEPTED`, `COMPLETED` con `evaluation`)
* `DELETE /api/donations/:id` — elimina (solo proprietario `DONOR` e solo `AVAILABLE`)

### Reports (`/api/reports`)

* `POST /api/reports` — crea segnalazione
* `GET /api/reports` — lista con query:
  * `scope=me|all` (`all` effettivo solo `ADMIN`)
  * `status=OPEN|IN_PROGRESS|CLOSED`
  * `type=MALFUNCTION|USER_BEHAVIOR`
* `GET /api/reports/:id` — dettaglio segnalazione (`ADMIN` o autore)
* `PATCH /api/reports/:id` — update parziale (stato, solo `ADMIN`)

### Auth (`/api/auth`)

* `POST /api/auth/users` — registrazione locale (crea utente)
* `POST /api/auth/sessions` — login locale (crea sessione JWT)
* `GET /api/auth/sessions/me` — utente corrente autenticato
* `GET /api/auth/google/authorize` — avvio OAuth Google
* `GET /api/auth/google/callback` — callback OAuth Google
* `POST /api/auth/google/sessions` — exchange token Google → login token o registration token
* `POST /api/auth/google/users` — completa registrazione Google
