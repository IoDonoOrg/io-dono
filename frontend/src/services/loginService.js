import api from "./api";


// formato della richiesta aspettato:
// {
// "email": "test@test.com",
// "password": "Test123$"
// }

// rotta: POST /auth/login
const localLogin = async (email, password) => {
  const loginData = {
    email: email,
    password: password
  };

  try {
    const response = await api.post('/auth/login', loginData);

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