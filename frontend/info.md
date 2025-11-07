# 📄 Info Progetto Frontend

Questo documento descrive la struttura generale del progetto, le convenzioni di naming e lo scopo dei file e delle cartelle principali.

## 🗂️ Struttura delle Cartelle

La struttura del progetto è organizzata per separare le responsabilità (separation of concerns), rendendo il codice più manutenibile e scalabile.

### Cartelle Root

* `/node_modules`: Contiene tutti i pacchetti e le dipendenze (es. React, Vite, Axios) scaricate da NPM. Viene gestita automaticamente e non va **mai** modificata o committata su Git.
* `/public`: Contiene asset statici che non vengono processati da Vite (il build tool). Vengono copiati così come sono nella build finale. È il posto giusto per `favicon.ico`, `robots.txt` o immagini che devono essere referenziate con un URL assoluto.
* `/src`: **La cartella principale** (source) che contiene tutto il codice sorgente della nostra applicazione.

---

### Cartelle in `/src` (Source)

* `/src/assets`: Contiene asset statici (immagini, SVG, font) che vengono **importati** direttamente all'interno dei componenti React (es. `import logo from './assets/react.svg'`). Questi file vengono processati e ottimizzati da Vite.
* `/src/components`: Contiene **componenti UI riutilizzabili**. Questi sono i "mattoncini" generici della nostra applicazione (es. `Button.jsx`, `Navbar.jsx`, `Card.jsx`). Un componente qui non dovrebbe essere legato a una pagina specifica, ma essere generico.
* `/src/pages`: Contiene i componenti che rappresentano **pagine intere** o "viste" dell'applicazione. Ogni file (o cartella) qui corrisponde tipicamente a una rotta definita in `router.jsx`.
* `/src/services`: Contiene tutta la logica di comunicazione con le **API esterne**. Funziona come uno strato di astrazione:
    * `api.js`: Definisce e configura l'istanza principale di `axios` (o `fetch`), impostando la `baseURL` (presa da `.env`), gli `headers` e gli *interceptors* (es. per allegare token di autenticazione a ogni chiamata).
    * `exampleServices.js`: Esporta funzioni specifiche che utilizzano l'istanza `api` per effettuare chiamate (es. `getUsers()`, `createPost(data)`). I componenti React chiameranno queste funzioni, non `axios` direttamente.
* `/src/utils`: Contiene funzioni di utilità ("helpers") pure e riutilizzabili, non legate a React o alle API. Ad esempio: `exampleUtility.js` potrebbe contenere funzioni per formattare date, validare email, o manipolare stringhe.

---

## 📄 File Principali

### File nella Root del Progetto

* `.env`: (File **non tracciato** da Git) Contiene le variabili d'ambiente segrete o specifiche per ogni ambiente (sviluppo, produzione). Vite espone al frontend solo le variabili che iniziano con il prefisso `VITE_`.
* `.gitignore`: Specifica quali file e cartelle Git deve ignorare (es. `node_modules`, `.env`, la cartella `dist` di build).
* `eslint.config.js`: File di configurazione per ESLint, un tool (linter) che analizza il codice e segnala errori di stile o potenziali bug.
* `index.html`: È il **vero entry point per il browser**. È il file HTML principale che l'utente carica. Il suo unico scopo è caricare l'app React (lo script `main.jsx`) e fornire a React un "punto di aggancio" (solitamente `<div id="root"></div>`) dove l'applicazione verrà renderizzata.
* `package.json`: Il cuore del progetto. Definisce il nome, la versione, gli script (`npm run dev`, `npm run build`) e tutte le dipendenze di sviluppo e produzione.
* `package-lock.json`: Un file generato automaticamente che "blocca" le versioni esatte di ogni dipendenza installata, per garantire che il progetto funzioni allo stesso modo su computer diversi.
* `vite.config.js`: Il file di configurazione per Vite (il nostro build tool e server di sviluppo). Qui si possono impostare plugin, ottimizzazioni e, soprattutto, il **server proxy** per inoltrare le chiamate API al backend durante lo sviluppo ed evitare problemi di CORS.

### File in `/src`

* `main.jsx`: È l'**entry point JavaScript** dell'applicazione. Questo file:
    1.  Importa gli stili globali (`index.css`).
    2.  Importa la configurazione delle rotte da `router.jsx`.
    3.  Usa `createRoot` (di React) per "agganciarsi" al `<div id="root">` definito in `index.html`.
    4.  Renderizza l'applicazione, fornendo le rotte tramite il componente `<RouterProvider />`.
* `router.jsx`: Definisce la **mappa delle rotte** dell'applicazione. Utilizza `createBrowserRouter` (di `react-router-dom`) per associare un percorso URL (es. `/`, `/example`) a un componente React da visualizzare (es. `<App />`, `<Example />`). È il "vigile" che decide quale pagina mostrare in base all'URL.
* `index.css`: Il foglio di stile **globale** dell'applicazione. Viene importato *una sola volta* in `main.jsx`. È il posto giusto per definire CSS reset, variabili CSS globali (`:root`), e stili di base per tag come `body` o `html`.


---

## 🧭 Convenzioni di Naming e Struttura

Per mantenere il codice pulito e coerente, seguiamo queste convenzioni:

### `src/components` (Componenti Riutilizzabili)

* **File:** I componenti sono nominati in `PascalCase`. Es: `Navbar.jsx`, `UserProfile.jsx`.
* **Struttura:** Per componenti semplici, un singolo file (`Button.jsx`) è sufficiente. Per componenti più complessi, si raccomanda di creare una cartella che "co-loca" (tiene vicini) i file correlati:

    > ```
    > src/components/
    > ├── Button/
    > │   ├── Button.jsx
    > │   └── Button.module.css  (Stili specifici per il bottone)
    > ```

### `src/pages` (Pagine/Viste)

* **File:** Le pagine sono nominate in `PascalCase`. Es: `HomePage.jsx`, `LoginPage.jsx`.
* **Struttura:** È caldamente consigliato usare una **cartella per ogni pagina**, come già impostato nel progetto (`/App`, `/Example`). Questo permette di "co-locare" i file relativi *solo* a quella pagina (i suoi stili specifici, eventuali sotto-componenti usati solo lì, e i file di test).

    > **Esempio (come nel progetto):**
    >
    > ```
    > src/pages/
    > ├── App/                 (Questa è una pagina, es. la Home o il Layout principale)
    > │   ├── App.jsx
    > │   └── App.css          (Stili applicati solo al componente App.jsx)
    > ├── Example/
    > │   └── Example.jsx      (Un'altra pagina, con i suoi stili importati o definiti nello stesso file)
    > ```
