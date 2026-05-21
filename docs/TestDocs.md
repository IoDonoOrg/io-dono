# Test API con Jest + Supertest

Questa cartella contiene test di integrazione API per il backend `io-dono`.

## Requisiti

- Node.js installato
- Dipendenze installate con `npm install`

## Esecuzione

```bash
npm test
```

## Coverage

```bash
npm run test:coverage
```

## Status attuale

- **Test Suites:** 5/5 passate
- **Test totali:** 61/61 passati
- **Coverage complessiva:**
  - Statements: `54.87%`
  - Branches: `36.12%`
  - Functions: `60.6%`
  - Lines: `57.55%`
- **Execution time:** ~18s (runInBand)

## Suite e copertura funzionale

- `auth.api.test.js` (9 test)
  - Registrazione pubblica `POST /api/auth/users`
  - Login `POST /api/auth/tokens`
  - **Role hardening esplicito:**
    - `DONOR` consentito
    - `ASSOCIATION` e `ADMIN` negati sul signup pubblico (`403`)

- `donations.api.test.js` (4 test)
  - Creazione donazione valida
  - Lista donazioni autenticata
  - Accesso senza token (`401`)
  - Validazione data pickup nel passato (`400`)

- `reports.api.test.js` (9 test)
  - Creazione report valida
  - Vincolo target (`reportedUserId` o `donationId`)
  - Regole visibilità (`me` vs `admin`)
  - Patch admin-only e validazione payload

- `rewards.api.test.js` (11 test)
  - Listing reward disponibili
  - Claim reward (`POST /api/me/rewards/claims`)
  - Listing claim personali con meta
  - Patch stato claim (`USED`/error path)
  - Casi errore: token mancante, id non valido, punti insufficienti

- `admin.api.test.js` (28 test)
  - Creazione associazione admin-only (`POST /api/admin/users`)
  - Ban/unban con audit fields
  - Protezione self-ban (`409`)
  - Enforcement utente bannato (`403` su endpoint autenticati)
  - Statistiche admin: overview, trend, filtrate

## Infrastruttura test

- I test usano MongoDB in-memory con **replica set** (`MongoMemoryReplSet`).
- Motivo: i flussi transazionali (`session.startTransaction`) richiedono replica set anche in ambiente test.
- Gestione DB in `tests/helpers/testDb.js`:
  - `connectTestDb()` avvia replica set in-memory e connette Mongoose
  - `clearTestDb()` pulisce le collection tra i test
  - `disconnectTestDb()` chiude connessione e arresta il replica set

## Nota sicurezza

- Non esiste bypass del role hardening in ambiente test.
- La registrazione pubblica resta limitata a `DONOR` in ogni ambiente.
- Gli utenti privilegiati (`ASSOCIATION`, `ADMIN`) vengono creati nei test tramite setup controllato (seed DB o endpoint admin).

## Strategia adottata

I test sono di integrazione end-to-end API:

- coprono HTTP layer + middleware + controller + model validation
- usano DB reale in-memory (no mock del persistence layer)
- verificano sia happy path sia failure path principali
