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

- `auth.api.test.js`
  - registrazione utente (`POST /api/auth/users`)
  - login (`POST /api/auth/sessions`)
  - caso errore email duplicata
  - caso errore credenziali errate

- `donations.api.test.js`
  - creazione donazione valida (`POST /api/donations`)
  - lettura lista donazioni autenticata (`GET /api/donations`)
  - accesso senza token (`401`)
  - caso frontiera: `pickupTime` nel passato (`400`)

- `reports.api.test.js`
  - creazione segnalazione valida (`POST /api/reports`)
  - errore creazione senza target (`400`)
  - visibilità report per utente non admin (`GET /api/reports`)
  - blocco patch per non admin (`403`)
  - patch stato per admin (`PATCH /api/reports/:id`)

## Note tecniche

- I test usano MongoDB in-memory (`mongodb-memory-server`) per evitare dipendenze da DB locale.
- L'ambiente di test viene inizializzato in `tests/setupEnv.js`.
- Connessione/pulizia DB in `tests/helpers/testDb.js`.
