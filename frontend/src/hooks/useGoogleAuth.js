import { useNavigate } from 'react-router-dom';
import { googleLogin, processGoogleResponse } from 'src/services/loginService';

export const useGoogleAuth = (alertData, setAlertData) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      const backendResponse = await googleLogin(googleResponse);

      // la funzione che gestice tipi di autenticazione con google
      // per dettagli guardare la definizione
      const result = processGoogleResponse(backendResponse);

      switch (result.case) {
        case "login":
          // TODO: localstorage
          // localStorage.setItem("token", backendResponse.loginToken);
          // localStorage.setItem("user", JSON.stringify(backendResponse.user));
          console.log("login");

          setAlertData({
            open: true,
            message: "Accesso effettuato con successo!",
            severity: "success",
          });

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1000);
          break;

        case "registration":
          // sessionStorage.setItem("registrationToken", backendResponse.registrationToken);
          console.log("registration");
          navigate("/registration-google", { replace: true });
          break;

        case "error":
          setAlertData({
            open: true,
            message: backendResponse.response.data.message,
            severity: "error",
          });
          console.log(backendResponse.response.data.message);
          break;

        default:
          setAlertData({
            open: true,
            message: "Errore sconosciuto durante il login.",
            severity: "error",
          });
      }
    } catch (error) {
      console.error("Errore imprevisto durante Google login:", error);
      setAlertData({
        open: true,
        message: "Si è verificato un errore imprevisto. Riprova.",
        severity: "error",
      });
    }
  };

  const handleGoogleError = (error) => {
    console.log("Errore Google Login: ", error);
    setAlertData({
      open: true,
      message: "Login con Google non riuscito, riprova.",
      severity: "error",
    });
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
    alertData,
    setAlertData,
  };
};