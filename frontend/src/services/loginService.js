import api from "./api";

/*
  Questo file contiene i servizi per il login, sia locale che con Google
- localLogin: invia email e password al backend per ottenere un token di autenticazione
- googleLogin: invia il token di Google al backend.
*/


// formato della richiesta aspettato:
// {
// "email": "test@test.com",
// "password": "Test123$"
// }

// POST /auth/sessions
// Questa funzione gestisce il login locale, inviando email e password al backend per ottenere un token di autenticazione
// Se il login ha successo, restituisce il token e i dati dell'utente
// In caso di errore, restituisce un messaggio di errore appropriato
const localLogin = async (email, password) => {
  const loginData = {
    email: email,
    password: password
  };

  try {
    const response = await api.post('/auth/sessions', loginData);

    console.log('Login effettuato con successo:', response.data);

    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    }

  } catch (error) {
    if (error.response) {
      const message = error.response?.data?.message || "Errore durante il login";
      return {
        success: false,
        message: message
      }
    }
  }
}

// Formato della richiesta aspettato:
// {
//   token: 'stringalungacredenzialegoogle'
// }
// POST /auth/google/sessions/token
// Questa funzione gestisce il login con Google, inviando il token di Google al backend
// Se l'utente è già registrato con Google, restituisce un token di login e i dati dell'utente
// Se l'utente non è ancora registrato con Google, restituisce un token di registrazione per completare la registrazione
const googleLogin = async (googleCredential) => {
  try {
    const response = await api.post("/auth/google/sessions", {
      token: googleCredential,
    });

    // l'utente si è registrato con google e sta cercando di fare login con google
    // good
    if (response.data.loginToken) {
      // console.log("login token: ", response.data.loginToken);
      return {
        loginToken: response.data.loginToken,
        user: response.data.user
      };
    }

    // l'utente cerca di accedere con un account google non ancora registrato
    if (response.data.registrationToken) {
      // console.log("registration token: ", response.data.registrationToken);
      return {
        registrationToken: response.data.registrationToken
      };
    }

    return response.data
  } catch (error) {
    console.log("Google Service Error:", error);

    // l'utente ha già un account registrato localmente ma cerca di accedere con google
    if (error.response && error.response.status === 400)
      return {
        localAccount: error.response.data.message
      };

    // Fallback
    return {
      message: "Errore imprevisto durante il login Google."
    };
  }
}

export { localLogin, googleLogin }