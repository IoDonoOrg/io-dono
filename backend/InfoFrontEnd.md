Sì, ci sono diverse accortezze fondamentali. La gestione dei token (JWT) è la responsabilità principale del client in un'architettura di autenticazione.

Ecco le 4 accortezze chiave che devi implementare nel tuo frontend React.

### 1. Archiviazione: `localStorage` vs. `useState`

La prima accortezza è sapere **dove** salvare il token. Come abbiamo discusso, tu ora hai **due** tipi di token:

#### A. Il Token di LOGIN (valido 3 ore)

Questo token serve per autenticare l'utente nelle chiamate API.

* **Dove salvarlo:** Nel **`localStorage`** del browser.
* **Perché:** Il `localStorage` persiste anche se l'utente chiude la scheda o il browser. Questo permette all'utente di rimanere "loggato" (il token rimane salvato).
* **Come (Esempio):**
  ```
  // Dopo che il login (locale o Google) è andato a buon fine
  // e il backend ti ha restituito { token, user }
  const { token, user } = await response.json();

  // Salva il token nel localStorage
  localStorage.setItem('authToken', token);

  // Salva i dati dell'utente nello "stato" globale di React (es. Context)
  // per aggiornare la UI
  impostaStatoUtente(user);

  ```

#### B. Il Token di REGISTRAZIONE (valido 15 min)

Questo token serve *solo* per il flusso di registrazione Google in 2 passaggi.

* **Dove salvarlo:** Nello  **stato di React (`useState`)** . **NON** salvarlo nel `localStorage`.
* **Perché:** È un token temporaneo, monouso. Non deve persistere. Deve solo "vivere" per il tempo necessario all'utente per compilare il form `/completa-registrazione`.
* **Come (Esempio):**
  ```
  // Nella pagina/componente che riceve il postMessage dal pop-up di Google
  const [registrationToken, setRegistrationToken] = useState(null);

  window.addEventListener('message', (event) => {
      if (event.data.registrationToken) {
          // Salva il token temporaneo nello *stato* del componente
          setRegistrationToken(event.data.registrationToken);
          // Reindirizza l'utente al form di completamento
          history.push('/completa-registrazione');
      }
  });

  ```

### 2. Invio: L'Header `Authorization: Bearer`

Questa è l'accortezza che hai chiesto esplicitamente. Ogni volta che fai una chiamata a un endpoint protetto del tuo backend (praticamente tutti, tranne login e register), devi **allegare il token di login** in un modo specifico.

* **Come:** Nell'header `Authorization`, usando lo schema `Bearer`.
* **Esempio con `fetch`:**
  ```
  // Prendi il token salvato dal localStorage
  const token = localStorage.getItem('authToken');

  const response = await fetch('/api/donations/create', {
      method: 'POST',
      headers: {
          // L'ACCORTEZZA FONDAMENTALE È QUESTA RIGA:
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* dati della donazione */ })
  });

  ```
* Se non includi questo header, o se il token è errato/scaduto, il tuo middleware `isAuth` nel backend rifiuterà la richiesta con un errore 401 (Unauthorized).

### 3. Centralizzazione: Il "Middleware" di React (Consigliato)

Come puoi vedere al punto 2, scrivere manualmente l'header `Authorization` per *ogni singola chiamata fetch* è noioso e facile da dimenticare.

L'accortezza "da professionista" è centralizzare questa logica, proprio come abbiamo fatto con i "Service" nel backend.

È qui che **Axios** (la libreria che avevamo menzionato) brilla. Ti permette di creare un'"istanza" che ha il token pre-configurato.

**Esempio (configurazione di un `apiService.js`):**

```
import axios from 'axios';

// 1. Crea un'istanza di Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api' // L'URL base del tuo backend
});

// 2. Aggiungi un "Interceptor" (il "middleware" di React)
// Questo codice viene eseguito PRIMA di ogni chiamata
api.interceptors.request.use(
    (config) => {
        // Prende il token dal localStorage
        const token = localStorage.getItem('authToken');
      
        // Se il token esiste, lo aggiunge agli header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Esporta questa istanza pre-configurata
export default api;

```

Come usarlo poi nei tuoi componenti:

D'ora in poi, invece di fetch, importerai e userai il tuo api service.

```
// In un altro file, es. Donazioni.jsx
import api from './apiService'; // Importa il tuo servizio

async function creaDonazione(dati) {
    // Non devi più preoccuparti di header o token.
    // L'interceptor lo aggiunge automaticamente.
    const response = await api.post('/donations/create', dati);
    return response.data;
}

```

### 4. Gestione del Logout

L'ultima accortezza è sapere cosa significa "Logout" per un'app basata su JWT.

Il "Logout" sul client è semplicemente  **dimenticare il token** .

* **Come:** Rimuovi il token dal `localStorage` e "pulisci" lo stato globale dell'utente.
* **Esempio di funzione `logout`:**
  ```
  function logout() {
      // 1. Rimuovi il token
      localStorage.removeItem('authToken');

      // 2. Pulisci lo stato utente globale (es. Context)
      impostaStatoUtente(null);

      // 3. Reindirizza alla pagina di login
      history.push('/login');
  }

  ```
