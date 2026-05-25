# io-dono

Piattaforma per la gestione delle donazioni, report e premi — codice sorgente Fullstack (Backend + Frontend).

**Indice**

- **Descrizione**: panoramica del progetto
- **Tecnologie**: stack usato
- **Struttura**: layout della repo
- **Installazione**: come avviare localmente
- **Variabili d'ambiente**: configurazioni principali
- **Test**: come eseguire la suite di test
- **Risorse**: documentazione e file utili

## Descrizione

`io-dono` è un'applicazione web Fullstack per gestire donazioni, report amministrativi e sistema premi. Il repository contiene il backend (API REST in Node/Express) e il frontend (app in React + Vite).

## Spiegazione del sito

Scopo: fornire una piattaforma che mette in contatto donatori e associazioni, semplificando la gestione delle campagne di raccolta fondi, il tracciamento delle donazioni e l'emissione di premi/riconoscimenti.

Flussi utente principali:

- Donatore anonimo: sfoglia campagne e associazioni, può avviare una donazione rapida senza registrazione (se abilitato).
- Utente registrato: gestisce il profilo, visualizza lo storico donazioni, salva metodi di pagamento e riceve premi o certificati collegati a soglie di donazione.
- Amministratore: crea/modifica campagne, approva o rifiuta donazioni manuali, genera report statistici e gestisce il catalogo premi.

Pagine e funzionalità chiave:

- Home: panoramica campagne in evidenza e statistiche pubbliche.
- Pagina Campagna: dettagli della campagna, obiettivi e pulsante di donazione.
- Flusso Donazione: selezione importo, checkout sicuro, conferma e ricevuta via email.
- Profilo utente: storico donazioni, impostazioni account e premi riscattati.
- Dashboard amministrativa: gestione campagne, utenti, premi e report.

Premi e ricompense: il sistema può associare premi a regole (es. soglie cumulativi) e gestire scadenze o stock dei premi.

Sicurezza e pagamenti: è prevista l'integrazione con gateway di pagamento esterni (es. Stripe) e l'uso di JWT/HTTPS per proteggere le API.

## Short site explanation (EN)

Purpose: a platform connecting donors and organizations to manage fundraising campaigns, donations and rewards.

Main user flows:

- Anonymous donor: browse campaigns and make quick donations (if enabled).
- Registered user: manage profile, view donation history, receive rewards for donation milestones.
- Admin: create and manage campaigns, review donations, and generate reports.

Key pages:

- Home, Campaign page, Donation checkout, User profile, Admin dashboard.

Payments are handled via external gateways (e.g. Stripe) and APIs are protected using JWT and HTTPS.

## Tecnologie

- Backend: Node.js, Express, Jest (test)
- Frontend: React, Vite
- DB: configurabile via variabili d'ambiente (es. PostgreSQL / MySQL / MongoDB)

## Struttura del repository

- [backend](backend): codice server, API, test e configurazioni
- [frontend](frontend): applicazione React e risorse UI
- [docs](docs): specifiche e documentazione (OpenAPI, appunti di architettura)

Per un'occhiata rapida ai file principali vedi:

- [backend/package.json](backend/package.json)
- [frontend/package.json](frontend/package.json)
- [docs/OpenApi.yaml](docs/OpenApi.yaml)

## Installazione e avvio (sviluppo)

Prerequisiti: Node.js 16+ (consigliato 18+), npm o pnpm

1. Clona il repository

```
git clone <repository-url>
cd io-dono
```

2. Backend

```
cd backend
npm install
npm run dev
```

3. Frontend

```
cd frontend
npm install
npm run dev
```

Ogni servizio avrà il proprio comando `dev`/`start` definito in `package.json`.

## Variabili d'ambiente

Il backend richiede alcune variabili d'ambiente comuni. Crea un file `.env` nella cartella `backend` con almeno le seguenti variabili (esempio):

```
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/io_dono
JWT_SECRET=una_chiave_lunga_e_sicura
```

Il frontend può richiedere variabili per l'endpoint API (es. `VITE_API_URL`). Controlla i file di configurazione in `frontend`.

## Eseguire i test

Backend (es.):

```
cd backend
npm test
```

Frontend (se presenti test):

```
cd frontend
npm test
```

## Deployment

Procedura generica:

1. Costruisci il frontend (`npm run build` in `frontend`) e sprema i file statici in un bucket o server statico.
2. Prepara il backend in ambiente di produzione con le variabili d'ambiente opportune.
3. Usa process manager (es. PM2) o container Docker per gestire il processo server.

Se vuoi posso aggiungere file `Dockerfile` e `docker-compose` per un deployment completo.

## Risorse utili

- Documentazione API: [docs/OpenApi.yaml](docs/OpenApi.yaml)
- Documentazione di test e architettura: [docs/TestDocs.md](docs/TestDocs.md)
