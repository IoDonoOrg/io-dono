import api from "./api";

// rotta: POST /auth/login
// formato della richiesta aspettato:
// {
// "email": "test@test.com",
// "password": "Test123$"
// }
// TODO: rivedere la funzione loginResult così che restituisce solo il codice HTTP
const localLogin = async (email, password) => {
  const loginData = {
    email: email,
    password: password
  };

  try {
    const response = await api.post('/auth/login', loginData);

    console.log('Login effettuato con successo:', response.data);
    return ""

  } catch (err) {
    if (err.response) {
      console.error('Login fallito:', err.response.data.message);
      return err.response.data.message;
    } else {
      console.error('Errore:', err.message);
      return err.message;
    }
  }
}


// rotta: POST /api/auth/google/token
// formato della richiesta aspettato:
// {
//   token: 'stringalungacredenzialegoogle'
// }
const googleLogin = async (googleCredentials) => {
  try {
    const googleCredential = googleCredentials.credential;

    // manda la credenziale al backend sulla rotta api/auth/google/token
    const response = await api.post("/auth/google/token", {
      token: googleCredential,
    });

    return response.data
  } catch (error) {
    return error;
  }
}

const processGoogleResponse = (backendResponse) => {
  /*
    Scenario A:
    L'utente è già registrato con google --> salvo i dati nella localstorage
    e lo reindirizzo alla pagina home
  */
  if (backendResponse.loginToken) {
    return {
      case: "login",
      token: backendResponse.loginToken,
      user: backendResponse.user,
    };
  }

  /*
    Scenario B:
    L'utente ha un account google valido ma non l'ha ancora registrato
    nella nostra app --> completo la registrazione reindirizzando l'utente alla pagina
    registrazione per utenti google
  */
  if (backendResponse.registrationToken) {
    return {
      case: "registration",
      token: backendResponse.registrationToken,
    };
  }

  /* 
    Scenario C: errore Backend --> notifico l'utente
  */
  return {
    case: "error",
    message: backendResponse?.response?.data?.message || "Errore sconosciuto",
  };
}


export { localLogin, googleLogin, processGoogleResponse }