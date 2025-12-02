import { googleLogin } from 'src/services/loginService';
import { useNavigate } from 'react-router-dom';

export const useGoogleAuth = (alertError, alertSuccess, alertInfo) => {
  const navigate = useNavigate();

  // const { login } = useAuth();

  const handleGoogleSuccess = async (googleResponse) => {
    console.log(googleResponse);
    try {
      const response = await googleLogin(googleResponse.credential);

      console.log(response);

      // l'utente registrato con google cerca di accedere
      if (response.loginToken) {
        console.log("login token: ", response.loginToken);
        // salva il token e lo user in localStorage
        // login(response.loginToken, response.user);

        alertSuccess("Accesso effettuato con successo!");

        // naviga l'utente alla home, introducendo un ritardo di 500ms 
        // per poter osservare la bellezza degli alert
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
        return;
      }

      // l'utente non ancora registrato cerca di accedere con google
      if (response.registrationToken) {
        alertInfo("Bisogna completare la registrazione. Reindirizzamento in corso.")
        console.log("registration token: ", response.registrationToken);

        // sessionStorage perché registrationToken non deve persistere oltre una sessione
        sessionStorage.setItem("registrationToken", response.registrationToken);
        setTimeout(() => {
          navigate("/registration", { replace: true });
        }, 3000);

        return;
      }


      // l'utente già registrato localmente cerca di accedere con google
      if (response.localAccount) {
        alertError(response.localAccount)
        return;
      }

      // fallback: errore imprevisto
      alertError(response.message);

      // gestione errori del server
    } catch (error) {
      console.log(error);
    }
  };

  // gestione fallimento API google
  const handleGoogleError = (error) => {
    console.log("Errore Google Login: ", error);
    alertError("Errore API Google");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};