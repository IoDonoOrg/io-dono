# API - Comandi curl per testare l'applicazione

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
# Registrazione (solo se necessario) - crea utente locale
curl -s -X POST "$BASE_URL/auth/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'","role":"DONOR","name":"Donor Test"}' | jq

# Login e salvataggio token (risposta attesa: { token: "..." })
TOKEN=$(curl -s -X POST "$BASE_URL/auth/sessions" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'"}' | jq -r .token)

# Verifica token
curl -s "$BASE_URL/auth/sessions/me" -H "Authorization: Bearer $TOKEN" | jq
```

Se non hai `jq`, stampa la risposta intera:

```bash
curl -i -X POST "$BASE_URL/auth/sessions" -H "Content-Type: application/json" -d '{"email":"'$DONOR_EMAIL'","password":"'$DONOR_PW'"}'
```

Flusso Donazioni (Donor)

1) Creare una donazione (ruolo DONOR)

```bash
curl -i -X POST "$BASE_URL/donations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Pane fresco","description":"Pane per famiglie","quantity":10,"pickupPointId":"<PICKUP_POINT_ID>"}'
```

Risposta: `201 Created` con body contenente la donazione creata (salvare l `_id` come DONATION_ID).

2) Elencare donazioni (opzionale filtro `?status=AVAILABLE`)

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/donations"
# oppure
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/donations?status=AVAILABLE"
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
  -d '{"title":"Pane integrale","quantity":8}'
```

5) Eliminare una donazione (proprietario)

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

7) Completare la donazione (ASSOCIATION set `status` a `COMPLETED`, opzionalmente invia `evaluation`)

```bash
curl -X PATCH "$BASE_URL/donations/<DONATION_ID>" \
  -H "Authorization: Bearer $ASSOC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED","evaluation":5}'
```

Nota: il completamento può scatenare transazioni che aggiornano punti solidarietà per il donor.

Flusso Segnalazioni (Reports)

1) Creare una segnalazione (qualsiasi utente autenticato)

```bash
curl -X POST "$BASE_URL/reports" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetId":"<DONATION_OR_RESOURCE_ID>","reason":"Ritiro non avvenuto","message":"Il punto di ritiro non rispondeva."}'
```

2) Elencare segnalazioni (ADMIN vede tutte, utente vede le proprie)

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/reports"
```

3) Recuperare segnalazione per id

```bash
curl -H "Authorization: Bearer $TOKEN" "$BASE_URL/reports/<REPORT_ID>"
```

4) Aggiornare lo status della segnalazione (ADMIN)

```bash
curl -X PATCH "$BASE_URL/reports/<REPORT_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"RESOLVED","note":"Verificato con utente."}'
```

Autenticazione Google (flusso token-frontend)

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

Verifiche Admin utili

- Elencare tutti gli utenti (se esiste endpoint admin):

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/users"
```

- Leggere log/metriche (dipende dall'app):

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/stats"
```
