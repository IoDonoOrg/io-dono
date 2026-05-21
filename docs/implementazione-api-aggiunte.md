> Sincronizzazione: questo documento riepiloga le implementazioni recenti e va mantenuto coerente con `docs/OpenApi.yaml`.
>
> Ultima sincronizzazione: 2026-05-21
>
# Implementazione API Aggiunte - Spiegazione Operativa

## 1. Scopo del documento

Questo file spiega in modo pratico le funzionalita backend aggiunte nell'ultima implementazione.
L'obiettivo e permetterti di capire subito:

- cosa e stato introdotto
- quali endpoint usare
- quali file sono stati toccati
- come funzionano i flussi principali

Ambito: solo backend API (stile REST, semplice, coerente con il progetto esistente).

---

## 2. Panoramica veloce delle novita

Sono state aggiunte 5 macro-aree:

1. Notifiche donatore (in-app)
2. Ricompense con attivazione e codice
3. Operazioni admin su utenti (creazione associazione, ban/unban)
4. Report associazione
5. Statistiche admin

Inoltre sono stati fatti 3 hardening/integration update:

1. Trigger notifiche nel flusso donazioni
2. Blocco utenti bannati nel middleware auth
3. Protezione route patch segnalazioni con `isAdmin`

---

## 3. Notifiche Donatore (RF13 - MVP in-app)

### Cosa e stato aggiunto

- Modello: `src/api/models/Notification.js`
- Controller: `src/api/controllers/notification.controller.js`
- Route: `src/api/routes/notification.routes.js`
- Mount nel router principale: `src/api/routes/mainRouter.js`

### Endpoint disponibili

- `GET /api/me/notifications`
  - Lista notifiche dell'utente autenticato
  - Filtri supportati: `page`, `limit`, `isRead`, `type`
- `PATCH /api/me/notifications/:id`
  - Aggiorna una notifica (es. `isRead: true`)
- `PATCH /api/me/notifications`
  - Aggiornamento bulk notifiche (es. segna tutte come lette)

### Flusso automatico implementato

Nel controller donazioni (`src/api/controllers/donation.controller.js`) sono stati aggiunti trigger:

- quando una donazione passa a `ACCEPTED` -> notifica `DONATION_ACCEPTED`
- quando passa a `COMPLETED` -> notifica `DONATION_COMPLETED`

Quindi il donatore riceve i messaggi senza chiamate extra lato associazione/admin.

---

## 4. Ricompense Donatore (RF16)

### Cosa e stato aggiunto

- Estensione modello reward: `src/api/models/Ricompensa.js`
- Nuovo modello claim: `src/api/models/RewardClaim.js`
- Controller: `src/api/controllers/reward.controller.js`
- Route reward: `src/api/routes/reward.routes.js`
- Route claim: `src/api/routes/rewardClaim.routes.js`
- Mount in `mainRouter.js`

### Campi nuovi modello Reward

Nel modello `Ricompensa` sono stati aggiunti:

- `isActive`
- `expiresAt`
- `maxRedemptions`
- `currentRedemptions`

Servono per gestire disponibilita e limiti in modo semplice.

### Endpoint disponibili

- `GET /api/rewards`
  - Lista reward disponibili per il donatore loggato
  - Espone anche `canRedeem` in base ai punti
- `GET /api/me/rewards/claims`
  - Lista attivazioni reward dell'utente
- `POST /api/me/rewards/claims`
  - Attiva una reward (`{ rewardId }`)
  - Scala punti e genera codice
- `PATCH /api/me/rewards/claims/:claimId`
  - Aggiorna stato claim (`USED` o `EXPIRED`)

### Regola punti implementata

- Default globale: `50`
- Override per reward: `reward.pointsCost`

In pratica:

- se la reward ha `pointsCost`, viene usato quello
- altrimenti usa la soglia default `50`

### Garanzie di coerenza

L'attivazione reward usa transazione MongoDB:

1. verifica disponibilita reward
2. verifica punti utente
3. crea claim con codice
4. scala punti
5. incrementa `currentRedemptions`
6. crea notifica di reward attivata

Se qualcosa fallisce, rollback.

---

## 5. Admin - Gestione Utenti

### Cosa e stato aggiunto

- Controller admin: `src/api/controllers/admin.controller.js`
- Route admin: `src/api/routes/admin.routes.js`
- Mount in `mainRouter.js`
- Estensione modello user: `src/api/models/User.js`

### Campi nuovi su User

- `isBanned`
- `bannedAt`
- `bannedReason`
- `bannedBy`

### Endpoint disponibili

- `POST /api/admin/users`
  - Crea account associazione (`role` forzato a `ASSOCIATION` nel controller)
- `PATCH /api/admin/users/:id`
  - Aggiorna stato admin dell'utente (ban/unban)

### Hardening auth

In `src/middleware/auth.middleware.js`:

- se `user.isBanned === true`, le route protette rispondono `403`.

Questo rende il ban effettivo subito sulle richieste autenticate.

---

## 6. Report Associazione (RF9)

### Cosa e stato aggiunto

- Controller: `src/api/controllers/associationReport.controller.js`
- Route: `src/api/routes/association.routes.js`
- Mount in `mainRouter.js`

### Endpoint disponibili

- `GET /api/associations/reports/weekly`
  - Report ultimi 7 giorni: numero donazioni, top donatori, stima impatto
- `GET /api/associations/reports/items?fromDate=&toDate=`
  - Tabella beni raccolti per giorno/tipologia + totali

> Nota: le rotte legacy `/associations/weekly` e `/associations/items` sono state rimosse il 2026-05-21. Usare i nuovi endpoint sotto `/api/associations/reports/`.

### Validazioni implementate

Sul range date:

- formato data invalido -> `400`
- inizio > fine -> `400`
- fine nel futuro -> `400`

---

## 7. Statistiche Admin (RF19)

### Cosa e stato aggiunto

Nel controller admin (`src/api/controllers/admin.controller.js`) sono state aggiunte 3 API statistiche:

- `GET /api/admin/statistics/overview`
  - KPI principali: donazioni, categorie, report, utenti per ruolo
- `GET /api/admin/statistics/trend`
  - Andamento donazioni nel tempo (aggregazione giornaliera)
- `GET /api/admin/statistics`
  - Statistiche con filtri: `area`, `itemType`, `fromDate`, `toDate`, `associationId`
  - Periodo default: ultimi 30 giorni

E presente anche estensione base "solo associazione" con riepilogo settimanale semplificato.

---

## 8. Segnalazioni (RF20) - miglioramenti

### Cosa e stato aggiornato

- Modello: `src/api/models/Segnalazione.js`
  - aggiunti `resolution`, `closedAt`, `closedBy`
- Controller: `src/api/controllers/report.controller.js`
  - filtri avanzati + paginazione in lista
  - patch status con metadati chiusura
- Route: `src/api/routes/report.routes.js`
  - `PATCH /:id` ora usa anche `isAdmin` a livello route

### Endpoint (esistenti, migliorati)

- `GET /api/reports` con filtri extra:
  - `status`, `type`, `scope`, `fromDate`, `toDate`, `reporterId`, `reportedUserId`, `page`, `limit`
- `PATCH /api/reports/:id`
  - aggiornamento stato con audit chiusura

---

## 9. Utility condivise (riduzione duplicazioni)

Per evitare logica duplicata e mantenere codice semplice e riusabile e stato creato:

- `src/utils/statistics.utils.js`

Contiene helper per:

- parsing quantita da stringa/numero
- validazione ObjectId
- costruzione/validazione range date con default

---

## 10. Router principali aggiornati

Il file `src/api/routes/mainRouter.js` ora monta anche:

- `/api/me/notifications`
- `/api/rewards`
- `/api/me/rewards/claims`
- `/api/admin`
- `/api/associations`

Questo completa l'integrazione delle nuove API nel punto centrale del progetto.

---

## 11. Compatibilita con codice esistente

La modifica e stata fatta cercando di non rompere l'esistente:

- route e pattern restano coerenti con lo stile attuale
- nessuna riscrittura pesante dei controller gia presenti
- integrazione incrementale con nuovi file dedicati

Inoltre, la suite test esistente continua a passare (`npm test`), quindi non sono state introdotte regressioni evidenti sul comportamento gia coperto dai test correnti.

---

## 12. Checklist rapida per provare a mano

1. Login come donatore e associazione.
2. Associazione accetta/completa una donazione.
3. Donatore verifica notifiche in `/api/me/notifications`.
4. Donatore prova `GET /api/rewards` e attiva claim con `POST /api/me/rewards/claims`.
5. Login admin, crea associazione con `POST /api/admin/users`.
6. Admin banna un utente con `PATCH /api/admin/users/:id` e verifica blocco accessi.
7. Associazione prova report weekly/items.
8. Admin prova overview/trend/statistics con query params.

Se tutti i passaggi sopra rispondono correttamente, il flusso principale delle nuove funzionalita e operativo.
