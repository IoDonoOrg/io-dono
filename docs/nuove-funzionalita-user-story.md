# Nuove Funzionalita - User Story e Specifiche

## 1. Obiettivo del documento

Questo documento descrive in modo preciso le nuove funzionalita richieste per la piattaforma Io-Dono.
Per ogni User Story sono definiti:

- attore
- obiettivo
- precondizioni
- flusso principale
- eccezioni
- dati/API backend coinvolti
- criteri di accettazione

Data versione: 2026-04-05
Ambito: backend + linee guida integrazione dashboard frontend

---

## 2. Panoramica funzionalita incluse

1. RF20 / User Story 10: visualizzazione segnalazioni da parte admin
2. RF13: ricezione notifiche per donatore
3. RF16: gestione ricompense donatore
4. User Story Admin aggiuntiva: ban/unban utente
5. User Story Admin aggiuntiva: creazione account associazione da admin
6. RF9: report associazione (settimanali + tabella per range date)
7. RF19: statistiche amministratore con filtri avanzati

---

## 3. User Story dettagliate

## US-10 (RF20) - Visualizzazione Segnalazioni (Admin)

### Attore

Amministratore

### Obiettivo

Visualizzare e gestire le segnalazioni di malfunzionamenti e comportamenti scorretti inviate dagli utenti.

### Precondizioni

- Utente autenticato con ruolo `ADMIN`
- Esistono segnalazioni nel sistema con stato `OPEN` o `CLOSED`

### Flusso principale

1. L'admin apre la sezione "Segnalazioni" dalla dashboard.
2. Il sistema mostra una lista ordinata per data desc.
3. L'admin puo applicare filtri (status, type, data inizio/fine, reporter, reportedUser).
4. L'admin apre il dettaglio di una segnalazione.
5. L'admin puo chiudere la segnalazione impostando esito/nota risoluzione.

### Eccezioni

1. Se l'utente non e admin: risposta `403 Forbidden`.
2. Se il reportId non e valido: risposta `400 Bad Request`.
3. Se la segnalazione non esiste: risposta `404 Not Found`.

### API backend previste

- `GET /api/reports?scope=all&status=&type=&fromDate=&toDate=&reporterId=&reportedUserId=&page=&limit=`
- `GET /api/reports/:id`
- `PATCH /api/reports/:id` (solo admin)

### Modelli coinvolti

- `Report (Segnalazione)`
  - campi principali: `reporterId`, `reportedUserId`, `donationId`, `type`, `description`, `status`
  - estensione consigliata: `closedAt`, `closedBy`, `resolution`

### Criteri di accettazione

1. Admin vede tutte le segnalazioni con `scope=all`.
2. Utente non-admin non puo vedere segnalazioni altrui.
3. Admin puo chiudere una segnalazione e il cambio stato viene persistito.
4. I filtri restituiscono risultati coerenti.

---

## US-13 (RF13) - Ricezione Notifiche Donatore

### Attore

Donatore

### Obiettivo

Ricevere notifiche private quando:

- una donazione viene accettata da un'associazione
- il ritiro viene completato

Nota di rilascio: MVP iniziale con notifiche in-app. Invio email previsto in fase successiva.

### Precondizioni

- Utente autenticato con ruolo `DONOR`
- Esiste almeno una donazione del donatore
- Una associazione esegue transizioni di stato valide sulla donazione

### Flusso principale

1. Donazione passa da `AVAILABLE` a `ACCEPTED`.
2. Il sistema genera una notifica in-app per il donatore.
3. Donazione passa da `ACCEPTED` a `COMPLETED`.
4. Il sistema genera una seconda notifica in-app.
5. Il donatore apre la sezione "Notifiche" dalla dashboard.
6. Il sistema mostra elenco notifiche e stato letto/non letto.
7. Il donatore marca una notifica come letta.

### Eccezioni

1. Se non autenticato: `401 Unauthorized`.
2. Se prova ad accedere alle notifiche di un altro utente: `403 Forbidden`.
3. Se id notifica non valido: `400 Bad Request`.
4. Se notifica assente: `404 Not Found`.

### API backend previste

- `GET /api/me/notifications?page=&limit=&isRead=&type=`
- `PATCH /api/me/notifications/:id` body `{ isRead: true }`
- (opzionale) `PATCH /api/me/notifications` body `{ isRead: true, scope: "all" }`

### Modelli coinvolti

- `Donation`
- `Notification` (nuovo)
  - campi: `recipientId`, `type`, `title`, `message`, `isRead`, `createdAt`

### Trigger applicativi

- In `PATCH donation`:
  - status `ACCEPTED` => crea notifica tipo `DONATION_ACCEPTED`
  - status `COMPLETED` => crea notifica tipo `DONATION_COMPLETED`

### Criteri di accettazione

1. Ogni transizione `ACCEPTED` genera notifica al donatore corretto.
2. Ogni transizione `COMPLETED` genera notifica al donatore corretto.
3. Elenco notifiche mostra solo messaggi del donatore loggato.
4. Mark-as-read aggiorna correttamente `isRead`.

---

## US-16 (RF16) - Gestione Ricompense Donatore

### Attore

Donatore privato

### Obiettivo

Accedere a una sezione ricompense, sbloccare/attivare ricompense usando punti solidali e ottenere un codice da presentare al partner.

### Regola punti

- Soglia default: ogni 50 punti solidali
- Modello ibrido: ogni reward puo avere `pointsCost` specifico (override della soglia default)

### Precondizioni

- Utente autenticato con ruolo `DONOR`
- L'utente ha punti sufficienti rispetto alla reward selezionata
- Reward attiva e non scaduta

### Flusso principale

1. Il donatore apre la sezione "Ricompense" dalla dashboard.
2. Il sistema mostra elenco reward disponibili + costo punti.
3. Il donatore clicca "Attiva" su una reward idonea.
4. Il sistema scala i punti e genera un codice univoco.
5. Il codice viene mostrato all'utente.
6. La reward viene rimossa dalla lista disponibili e spostata in storico attivate/usate.

### Eccezioni

1. Punti insufficienti => `409 Conflict`.
2. Reward non trovata/non attiva/scaduta => `404` o `409`.
3. Tentativo doppia attivazione simultanea => una sola attivazione valida.

### API backend previste

- `GET /api/rewards`
- `GET /api/me/rewards/claims`
- `POST /api/me/rewards/claims` body `{ rewardId }`
- `PATCH /api/me/rewards/claims/:claimId` body `{ status: "USED" }` (quando la reward viene consumata)

### Modelli coinvolti

- `User` (`solidarityPoints`)
- `Reward` (esteso con metadati attivazione)
- `RewardClaim` (nuovo)
  - campi: `userId`, `rewardId`, `status`, `activationCode`, `activatedAt`, `usedAt`

### Criteri di accettazione

1. Con punti sufficienti la reward si attiva e genera codice univoco.
2. I punti vengono scalati una sola volta.
3. Con punti insufficienti non si crea alcun claim.
4. La reward attivata non compare piu tra le "disponibili".

---

## US-ADMIN-01 - Ban/Unban Utente

### Attore

Amministratore

### Obiettivo

Bloccare o sbloccare account che violano policy o ricevono segnalazioni confermate.

### Precondizioni

- Utente autenticato admin
- Utente target esistente

### Flusso principale

1. Admin visualizza dettaglio utente.
2. Admin preme "Ban" inserendo motivazione.
3. Sistema marca account come bannato.
4. Utente bannato viene bloccato sugli endpoint autenticati successivi.
5. Admin puo eseguire "Unban" in un secondo momento.

### Eccezioni

1. Admin prova a bannare se stesso => `409 Conflict`.
2. Utente target non esiste => `404 Not Found`.
3. Richiesta non-admin => `403 Forbidden`.

### API backend previste

- `PATCH /api/admin/users/:id` body `{ isBanned: true|false, bannedReason }`

### Modelli coinvolti

- `User` (estensione)
  - `isBanned`, `bannedAt`, `bannedReason`, `bannedBy`

### Criteri di accettazione

1. Solo admin puo bannare/sbloccare.
2. Utente bannato non puo usare endpoint protetti.
3. Operazione ban/unban e tracciata.

---

## US-ADMIN-02 - Creazione Account Associazione da Admin

### Attore

Amministratore

### Obiettivo

Creare in modo controllato account associazione dal pannello admin.

### Precondizioni

- Admin autenticato
- Email non gia registrata

### Flusso principale

1. Admin apre sezione "Gestione Associazioni".
2. Inserisce dati nuova associazione.
3. Sistema crea utente con ruolo `ASSOCIATION`.
4. Sistema restituisce conferma e dati account.

### Eccezioni

1. Email duplicata => `400 Bad Request`.
2. Richiesta da non-admin => `403 Forbidden`.
3. Payload incompleto => `400 Bad Request`.

### API backend previste

- `POST /api/admin/users` body con `role: "ASSOCIATION"`

### Note sicurezza

- Endpoint pubblico `POST /api/auth/users` non deve consentire creazione ruoli privilegiati arbitrari.

### Criteri di accettazione

1. Solo admin crea associazioni.
2. Nessun utente standard puo auto-registrarsi come admin/association tramite endpoint pubblico.
3. Account creato rispetta schema utente e validazioni.

---

## US-09 (RF9) - Report Associazione

### Attore

Associazione

### Obiettivo

Visualizzare report automatici e statistiche beni raccolti per supportare il monitoraggio operativo.

### Precondizioni

- Utente autenticato con ruolo `ASSOCIATION`
- Esistono donazioni accettate/completate associate all'associazione

### Flusso principale A - Report settimanale

1. L'associazione apre la sezione report dalla dashboard.
2. Il sistema mostra report settimanale con:
   - numero donazioni ricevute
   - utenti piu attivi
   - impatto stimato spreco ridotto

### Flusso principale B - Tabella beni per range date

1. L'associazione seleziona `fromDate` e `toDate`.
2. Clicca "Visualizza statistiche".
3. Il sistema mostra tabella giornaliera per tipologia bene.
4. Il sistema mostra riga finale con totali complessivi.

### Eccezioni

1. `fromDate > toDate` => `400`.
2. `toDate > oggi` => `400`.
3. Formato data invalido => `400`.

### API backend previste

- `GET /api/associations/reports/weekly`
- `GET /api/associations/reports/items?fromDate=&toDate=`

> Nota: le rotte legacy `/associations/weekly` e `/associations/items` sono state rimosse il 2026-05-21. Usare i nuovi endpoint sotto `/api/associations/reports/`.

### Modelli coinvolti

- `Donation` (status, items, associationId, dates)
- `User` (per identificare utenti attivi)

### Criteri di accettazione

1. Report settimanale disponibile da dashboard associazione.
2. Tabella per range date corretta con totale finale.
3. Tutte le eccezioni data producono errore esplicito.

---

## US-19 (RF19) - Statistiche Amministratore

### Attore

Amministratore

### Obiettivo

Consultare statistiche aggregate su donazioni/raccolta cittadina con filtri.

### Precondizioni

- Admin autenticato
- Dati donazioni disponibili nel periodo analizzato

### Flusso principale

1. In dashboard admin il sistema mostra:
   - tabella totale donazioni per categoria
   - grafico andamento donazioni nel tempo
2. Admin apre pagina "Statistiche".
3. Imposta filtri: area geografica, tipologia bene, periodo, associazione.
4. Clicca "Visualizza".
5. Sistema restituisce dataset filtrato.
6. Se e specificata solo associazione, sistema mostra anche report settimanali di quella associazione.

### Eccezioni / default

1. Area non valida o fuori perimetro accesso admin => `403` o `400`.
2. Tipologia non specificata => tutte le tipologie.
3. Periodo non specificato => ultimi 30 giorni.
4. Associazione non specificata => tutte le associazioni nel territorio consentito.

### API backend previste

- `GET /api/admin/statistics/overview`
- `GET /api/admin/statistics/trend?fromDate=&toDate=&granularity=`
- `GET /api/admin/statistics?area=&itemType=&fromDate=&toDate=&associationId=`

### Modelli coinvolti

- `Donation` (aggregazioni per tempo, categoria, area)
- `User` (ruoli, associazioni)
- `Report` (integrazione eventuale indicatori qualitativi)

### Criteri di accettazione

1. Dashboard admin mostra KPI base senza filtri manuali.
2. Filtri funzionano con default richiesti.
3. Regole di accesso area vengono rispettate.
4. Estensione "solo associazione" restituisce anche report settimanali.

---

## 4. Requisiti tecnici trasversali

1. Sicurezza ruoli obbligatoria su endpoint admin (`isAdmin` route-level).
2. Audit minimo per azioni sensibili admin (ban/unban, chiusura segnalazioni, creazione associazioni).
3. Paginazione su endpoint lista (`page`, `limit`) dove necessario.
4. Validazione input centralizzata (date, ObjectId, enum).
5. Test automatici per regressioni su auth, reports, donations, notifications, rewards, admin stats.

## 4.1 Vincoli obbligatori implementazione REST

1. API strettamente RESTful: risorse al plurale, URI stabili e semantici, no verbi nell'URL.
2. Metodi HTTP coerenti:
  - `GET` per lettura
  - `POST` per creazione
  - `PATCH` per aggiornamento parziale
  - `DELETE` per rimozione logica/fisica quando previsto
3. Uso dei codici HTTP corretti e consistenti in tutte le US:
  - `200` successo lettura/aggiornamento
  - `201` creazione
  - `204` cancellazione senza body
  - `400` input non valido
  - `401` non autenticato
  - `403` non autorizzato
  - `404` risorsa assente
  - `409` conflitto di stato business
4. Response JSON uniformi e predicibili (chiavi consistenti per `status`, `message`, `data`).
5. Supporto standard a paginazione/filtri/ordinamento sulle liste principali.

## 4.2 Standard test (allineamento ai test gia presenti)

1. Stack test invariato: `jest` + `supertest` + helper DB in `tests/helpers/testDb.js`.
2. Struttura suite da mantenere come nelle suite esistenti:
  - `beforeAll(connectTestDb)`
  - `afterEach(clearTestDb)`
  - `afterAll(disconnectTestDb)`
3. Per ogni endpoint nuovo/modificato coprire sempre:
  - happy path
  - validazione input
  - autorizzazione/permessi ruolo
  - risorsa non trovata
  - conflitti di stato
4. Naming test esplicito e descrittivo in italiano, coerente con il pattern attuale.
5. Per feature transazionali (punti/ricompense/notifiche), includere test anti-regressione e anti-doppia elaborazione.

## 4.3 Documentazione YAML obbligatoria

1. Contratto API ufficiale in YAML OpenAPI: file fornito esternamente e collegato a questo documento.
2. Ogni nuova US deve avere nel YAML:
  - endpoint
  - parametri path/query
  - requestBody
  - risposte per status code principali
  - schema dati
3. Quando il file YAML viene caricato, va mantenuto allineato a ogni modifica del contratto API prima del merge.

---

## 5. Tracciabilita RF -> Endpoint

| RF / US      | Endpoint principali                                                                   |
| ------------ | ------------------------------------------------------------------------------------- |
| RF20 / US-10 | `GET /api/reports`, `GET /api/reports/:id`, `PATCH /api/reports/:id`            |
| RF13 / US-13 | `GET /api/me/notifications`, `PATCH /api/me/notifications/:id`                    |
| RF16 / US-16 | `GET /api/rewards`, `POST /api/me/rewards/claims`, `GET /api/me/rewards/claims` |
| US-ADMIN-01  | `PATCH /api/admin/users/:id`                                                        |
| US-ADMIN-02  | `POST /api/admin/users`                                                              |
| RF9 / US-09  | `GET /api/associations/reports/weekly`, `GET /api/associations/reports/items`     |
| RF19 / US-19 | `GET /api/admin/statistics/overview`, `GET /api/admin/statistics`                 |

---
