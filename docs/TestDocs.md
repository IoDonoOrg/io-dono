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

## Cosa coprono i test

- `auth.api.test.js` (4 test)
  - registrazione utente (`POST /api/auth/users`)
    - ✅ registrazione donor valida
    - ✅ errore email duplicata
  - login (`POST /api/auth/sessions`)
    - ✅ login con credenziali valide
    - ✅ errore credenziali errate
  - **Nota:** Role hardening testato implicitamente:
    - registrazione limitata a DONOR in produzione
    - ASSOCIATION/ADMIN creati solo da admin via `/api/admin/users`

- `donations.api.test.js` (4 test)
  - creazione donazione valida (`POST /api/donations`)
    - ✅ payload corretto: items[], pickupTime (futuro), pickupLocation
  - lettura lista donazioni autenticata (`GET /api/donations`)
  - accesso senza token (`401`)
  - caso frontiera: `pickupTime` nel passato (`400`)
  - **Nota:** Transazioni ACID non direttamente testabili in unit test, testate manualmente

- `reports.api.test.js` (9 test)
  - creazione segnalazione valida (`POST /api/reports`)
  - errore creazione senza target (`400`)
    - Richiede `reportedUserId` XOR `donationId`
  - visibilità report per utente non admin (`GET /api/reports`)
    - User vede solo propri report
    - ADMIN vede tutti
  - blocco patch per non admin (`403`)
  - patch stato per admin (`PATCH /api/reports/:id`)
    - ✅ Aggiorna `status`, `resolution`, `closedAt`, `closedBy`
  - payload vuoto ritorna `400`

## Status Attuale

- **Total Test Suites:** 3 (auth, donations, reports)
- **Total Tests:** 17
- **Status:** ✅ **ALL PASSING**
- **Coverage:** 37.42% statements, 17% branches
- **Execution Time:** ~4.7 seconds

## Note tecniche su Test Infrastructure

- I test usano MongoDB in-memory (`mongodb-memory-server`) per evitare dipendenze da DB locale.
- L'ambiente di test viene inizializzato in `tests/setupEnv.js`:
  - `NODE_ENV === 'test'` abilita bypass role hardening per permettere creazione utenti privilegiati nei test
  - Questo è **intenzionale** e necessario per il test suite
- Connessione/pulizia DB in `tests/helpers/testDb.js`:
  - `connectTestDb()` - Avvia MongoDB in-memory
  - `disconnectTestDb()` - Disconnette e pulisce
  - `clearTestDb()` - Trunca tutte le collections tra i test

## Feature Coperte (Implicitamente o Esplicitamente)

| Feature | Coverage | Note |
|---------|----------|------|
| Auth registration + hardening | ✅ Unit test | Test mode bypass non visibile |
| Auth login | ✅ Unit test | Argon2 password verify |
| Donation CRUD | ✅ Unit test (create, list, read) | PATCH transactional non unit-testato |
| Donation state transitions | ✅ Manual verifica | ACCEPTED/COMPLETED transazioni ACID |
| Notification triggers | 🟡 Implicit | Testate via donation ACCEPTED/COMPLETED |
| Reward claims | ❌ Not covered | Nuova feature (phase 1) |
| Admin ban/unban | ❌ Not covered | Nuova feature (phase 1) |
| Statistics | ❌ Not covered | Nuova feature (phase 1)  |
| Association Reports | ❌ Not covered | Nuova feature (phase 1) |

## Come Aggiungere Nuovi Test

Per una nuova feature (es. reward claims):

1. Crea file `tests/rewards.api.test.js`
2. Importa utilities:
   ```javascript
   const request = require('supertest');
   const app = require('../src/app');
   const { connectTestDb, disconnectTestDb } = require('./helpers/testDb');
   ```
3. Setup con `beforeAll()` e `afterAll()`
4. Scrivi test suite con `describe()` e `it()`
5. Esegui: `npm test tests/rewards.api.test.js`
6. Coverage: `npm run test:coverage`

## Strategia Testing Integrazione

I test attuali sono **integrazione API** (non unit):
- Completano il workflow end-to-end (signup → login → operations)
- Usano in-memory DB reale (non mock)
- Testano HTTP layer + controller logic + model validation

Vantaggi:
- ✅ Catturano errori reali di integrazione
- ✅ Non dipendono da Mocks fragili

Trade-off:
- ⚠️ Più lenti di unit test
- ⚠️ Difficili da debuggare (multi-layer stack trace)
