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
const googleLogin = async (googleCredential) => {
  try {
    const response = await api.post("/auth/google/token", {
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