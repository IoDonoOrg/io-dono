# API - Comandi curl per testare l'applicazione

> Sincronizzazione: questo documento è mantenuto manualmente e riflette lo stato della API descritto in `docs/OpenApi.yaml`.
>
> Ultima sincronizzazione: 2026-05-21
>
> Per mantenere aggiornato questo file: aggiornare `docs/OpenApi.yaml` e poi adattare gli esempi `curl` presenti qui in base ai nuovi percorsi/parametri. Commitare entrambe le modifiche.

Questo file raccoglie comandi `curl` (con esempi) per verificare i flussi principali: autenticazione (locale e Google), donazioni, segnalazioni e operazioni amministrative.

Prerequisiti

- Server in esecuzione, es: `http://localhost:3000`
- `jq` (opzionale) per estrarre campi JSON in shell

Variabili utili (esempio):

- BASE_URL: `http://localhost:3000/api`
- DONOR_EMAIL / DONOR_PW: credenziali test per donor
- ASSOC_EMAIL / ASSOC_PW: credenziali test per association
- ADMIN_EMAIL / ADMIN_PW: credenziali test per admin

Esempio impostazione variabili in bash:

```bash
export BASE_URL="http://localhost:3000/api"
export DONOR_EMAIL="donor@example.com"
export DONOR_PW="Pass1234"
export ASSOC_EMAIL="assoc@example.com"
export ASSOC_PW="Pass1234"
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PW="Pass1234"
```

Utility: login e ricavo token (con `jq`)

```bash
# Registrazione pubblica (solo ruolo DONOR)
curl -s -X POST "$BASE_URL/auth/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'","role":"DONOR","name":"Donor Test","phoneNumber":"+39 02 1234567","address":"Via Roma 123, Milano"}' | jq

# Login e salvataggio token (risposta attesa: { token: "..." })
TOKEN=$(curl -s -X POST "$BASE_URL/auth/tokens" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'"}' | jq -r .token)

# Verifica token
curl -s "$BASE_URL/auth/me" -H "Authorization: Bearer $TOKEN" | jq
```

Nota sicurezza: `POST /api/auth/users` consente solo `DONOR`.
Per creare utenti `ASSOCIATION` usare `POST /api/admin/users` con `ADMIN_TOKEN`.

Se non hai `jq`, stampa la risposta intera:

```bash
curl -i -X POST "$BASE_URL/auth/tokens" -H "Content-Type: application/json" -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'"}'
```

Flusso Donazioni (Donor)

1) Creare una donazione (ruolo DONOR)

```bash
curl -i -X POST "$BASE_URL/donations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"type": "FOOD", "name": "Pane fresco", "quantity": "10 pani"},
      {"type": "CLOTHING", "name": "Magliette", "quantity": "5 pezzi"}
    ],
    "pickupTime": "2026-04-15T14:00:00Z",
    "pickupLocation": {
      "address": "Via Roma 123, Milano",
      "geo": {"type": "Point", "coordinates": [9.19, 45.46]}
    },
    "notes": "Ritiro solo al mattino"
  }'
```

Risposta: `201 Created` con body contenente la donazione creata (salvare l `_id` come DONATION_ID).

2) Elencare donazioni (opzionale filtro `?status=AVAILABLE`)

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/donations"
# oppure
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/donations?status=AVAILABLE"
# ASSOCIATION vede AVAILABLE globali + proprie ACCEPTED/COMPLETED
# ADMIN vede tutte con filtri avanzati
```

3) Recuperare una donazione per id

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/donations/<DONATION_ID>"
```

4) Aggiornare parzialmente (proprietario DONOR può modificare se status=AVAILABLE)

```bash
curl -X PATCH "$BASE_URL/donations/<DONATION_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"type": "FOOD", "name": "Pane integrale", "quantity": "8 pani"}]}'
```

5) Eliminare una donazione (proprietario DONOR, solo se status=AVAILABLE)

```bash
curl -i -X DELETE "$BASE_URL/donations/<DONATION_ID>" -H "Authorization: Bearer $TOKEN"
```

Flusso Accettazione/Completamento (Association)

- Login association e ottenere `ASSOC_TOKEN` (stesso metodo del login sopra, usando ASSOC_EMAIL/ASSOC_PW)

6) Accettare una donazione (ASSOCIATION cambia `status` a `ACCEPTED`)

```bash
curl -X PATCH "$BASE_URL/donations/<DONATION_ID>" \
  -H "Authorization: Bearer $ASSOC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"ACCEPTED"}'
```

Nota: trigger automatico crea `Notification` di tipo `DONATION_ACCEPTED` al donor.

7) Completare la donazione (ASSOCIATION set `status` a `COMPLETED`, opzionalmente invia `evaluation`)

```bash
curl -X PATCH "$BASE_URL/donations/<DONATION_ID>" \
  -H "Authorization: Bearer $ASSOC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED","evaluation":5}'
```

Nota: Il completamento è transazionale (ACID). Aggiorna stato + crea notifica + incrementa `solidarityPoints` del donor atomicamente.

Flusso Segnalazioni (Reports)

1) Creare una segnalazione (qualsiasi utente autenticato)

```bash
curl -X POST "$BASE_URL/reports" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reportedUserId":"<USER_ID>","type":"USER_BEHAVIOR","description":"Comportamento scorretto durante il ritiro."}'
```

Oppure per segnalare una donazione:

```bash
curl -X POST "$BASE_URL/reports" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"donationId":"<DONATION_ID>","type":"MALFUNCTION","description":"La donazione non è ancora arrivata."}'
```

2) Elencare segnalazioni (ADMIN vede tutte, utente vede le proprie)

```bash
# Utente normale
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/reports"

# ADMIN vede tutte
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/reports?scope=all"

# Con filtri
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/reports?scope=all&status=OPEN&type=USER_BEHAVIOR"
```

3) Recuperare segnalazione per id

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/reports/<REPORT_ID>"
```

4) Aggiornare segnalazione - chiudi e risolvi (ADMIN ONLY)

```bash
curl -X PATCH "$BASE_URL/reports/<REPORT_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CLOSED","resolution":"Verificato con utente. Problema risolto contattando l'\''associazione."}'
```

Nota: Il sistema registra automaticamente `closedAt` (timestamp) e `closedBy` (admin ID) per audit trail.

## Flusso Notifiche (Donor)

1) Elencare notifiche personali

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/me/notifications"

# Con filtri
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/me/notifications?isRead=false&type=DONATION_ACCEPTED&page=1&limit=20"
```

Tipi disponibili: `DONATION_ACCEPTED`, `DONATION_COMPLETED`, `REWARD_ACTIVATED`, `SYSTEM`.

2) Marcare una notifica come letta

```bash
curl -X PATCH "$BASE_URL/me/notifications/<NOTIFICATION_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isRead":true}'
```

3) Marcare multiple notifiche come lette (bulk)

```bash
curl -X PATCH "$BASE_URL/me/notifications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isRead":true,"type":"DONATION_ACCEPTED"}'
```

## Flusso Ricompense (Donor)

1) Elencare ricompense disponibili

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/rewards"
```

Risposta include `defaultPointsThreshold` (50 punti) e punti attuali dell'utente.

2) Attivare una ricompensa (TRANSAZIONALE - atomico con punti)

```bash
curl -X POST "$BASE_URL/me/rewards/claims" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rewardId":"<REWARD_ID>"}'
```

Risposta: `201 Created` con `activationCode` (codice univoco per riscattare la ricompensa).
La transazione è ACID: punti detratti + claim creato + notifica inviata oppure rollback totale.

3) Elencare i miei reward activati

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/me/rewards/claims"

# Con filtri
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/me/rewards/claims?status=ACTIVATED&page=1&limit=20"
```

4) Aggiornare stato di un claim (es. marcare come USED)

```bash
curl -X PATCH "$BASE_URL/me/rewards/claims/<CLAIM_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"USED"}'
```

## Flusso Amministrazione (Admin)

1) Creare account associazione (ADMIN ONLY)

```bash
curl -X POST "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"nuova-associazione@example.com",
    "password":"SecurePass123",
    "name":"Associazione SOS",
    "phoneNumber":"+39 02 1234567",
    "address":"Via Garibaldi 45, Milano"
  }'
```

Nota: Il ruolo è forzatamente impostato a `ASSOCIATION`. Risposta: `201 Created`.

2) Bannare un utente (ADMIN ONLY, non può bannare se stesso)

```bash
curl -X PATCH "$BASE_URL/admin/users/<USER_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isBanned":true,"bannedReason":"Violazione termini di servizio"}'
```

Risposta registra automaticamente `bannedAt` (timestamp) e `bannedBy` (admin ID).

Errore `409 Conflict` se provi a bannare te stesso.

3) Sbannare un utente

```bash
curl -X PATCH "$BASE_URL/admin/users/<USER_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isBanned":false}'
```

4) Statistiche dashboard - overview KPI (ultimi 30 giorni)

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/statistics/overview"
```

Ritorna: donazioni totali per categoria, segnalazioni per stato, utenti per ruolo.

5) Statistiche trend - donazioni giorno per giorno

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/statistics/trend"

# Con range personalizzato
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/statistics/trend?fromDate=2026-03-01&toDate=2026-04-05"
```

6) Statistiche filtrate con query params

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/statistics?area=Milano&itemType=FOOD&fromDate=2026-03-01&toDate=2026-04-05"
```

## Flusso Associazioni (Association Reports)

1) Report settimanale (ultimi 7 giorni)

```bash
curl -H "Authorization: Bearer $ASSOC_TOKEN" "$BASE_URL/associations/reports/weekly"
```

Nota: le rotte legacy `/associations/weekly` e `/associations/items` sono state rimosse (2026-05-21). Usare i percorsi sotto `/associations/reports/` mostrati sopra.

Ritorna: donazioni completate, top 5 donatori, stima peso rifiuti evitati.

2) Report itemizzato per range date

```bash
curl -H "Authorization: Bearer $ASSOC_TOKEN" "$BASE_URL/associations/reports/items?fromDate=2026-03-01&toDate=2026-04-05"
```

Ritorna: aggregazione giornaliera per tipo di bene + totali.

- Scambiare un Google ID token per un token applicativo:

```bash
curl -X POST "$BASE_URL/auth/google/sessions" \
  -H "Content-Type: application/json" \
  -d '{"id_token":"<GOOGLE_ID_TOKEN>"}'
```

- Registrare un nuovo utente Google (se la app richiede un endpoint separato):

```bash
curl -X POST "$BASE_URL/auth/google/users" \
  -H "Content-Type: application/json" \
  -d '{"id_token":"<GOOGLE_ID_TOKEN>"}'
```

(Se l'app utilizza la callback OAuth via browser, usare la rotta `/api/auth/google/authorize` e la callback `/api/auth/google/callback`.)

Nota: in questa codebase non sono esposti endpoint `GET /api/admin/users` o `GET /api/admin/stats`.
