import {
  TextField,
  Button,
  Container,
  Box,
  Link,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import PasswordField from "src/components/form/PasswordField";

import { GoogleLogin } from "@react-oauth/google";
import { validateEmail, validatePassword } from "src/utils/validation";
import { localLogin } from "src/services/loginService";
import AlertSnack from "src/components/ui/AlertSnack";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";
import { useAuth } from "src/hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // hook customizzati
  const { alertData, alertSuccess, alertError, alertInfo, hideAlert } =
    useAlert();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    alertError,
    alertSuccess,
    alertInfo
  );

  // determina se c'è un percorso "from"
  // si -> dopo l'autenticazione l'utente sarà reindirizzato lì
  // altrimenti verrà rindirizzato alla rotta "/"
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    // non ricarica la pagina appena accade un evento (il comportamento di default)
    // così sfruttiamo il client side loading di React
    event.preventDefault();

    // chiama una funzione helper validateEmail
    // ritorna una stringa vuota se la mail è corretta
    // altrimenti ritorna il rispettivo messaggio d'errore (guardare la definizione per dettagli)
    const emailResult = validateEmail(email);
    setEmailError(emailResult);

    // chiama una funzione helper validatePassword
    // ritorna una stringa vuota se la password è corretta (guardare la definizione per dettagli)
    // altrimenti ritorna il rispettivo messaggio d'errore
    const passwordResult = validatePassword(password);
    setPasswordError(passwordResult);

    // una stringa vuota dentro una if è considerata "false"
    // controlla se almeno uno dei due non è vuoto altrimenti ritorna
    if (emailResult || passwordResult) return;

    // console.log("La form è valida:", { email, password });

    // fa una chiamata al backend
    const response = await localLogin(email, password);

    if (!response) {
      alertError("Errore backend");
      return;
    }

    // console.log(response);
    if (!response.success) {
      // se siamo qua allora il backend non ha autenticato l'utente
      // --> notifica l'utente
      alertError(response.message);
      return;
    }

    // se siamo qua allora la login è andata a buon fine --> notifica l'utente
    // e lo reindirizza alla home
    alertSuccess("Accesso effettuato con successo!");

    // la funzione che salva nel localStorage il token e l'oggetto user ricevuti dal backend
    login(response.token, response.user);

    setTimeout(() => {
      // replace: true sostituice /login nel browser
      // così che l'utente non potrà tornare al login cliccando la freccia del browser
      navigate(from, { replace: true });
    }, 500); // introduce un ritardo di 500ms per poter osservare la bellezza degli alert
  };

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
      <div className="min-h-screen flex items-center justify-center">
        <Container
          maxWidth="xs"
          className="bg-white p-8 border-2 border-gray-100/35 rounded-lg shadow-md/15"
        >
          <Box>
            <Typography
              className="text-center"
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              Login
            </Typography>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // !! converta la stringa in un booleano
                error={!!emailError}
                helperText={emailError}
              />
              <PasswordField
                passwordValue={password}
                onPasswordChange={setPassword}
                error={!!passwordError}
                errorText={passwordError}
                label="Password *"
              />
              <Button
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
              >
                Accedi
              </Button>
            </form>
          </Box>

          <Box className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-600 text-sm">oppure</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </Box>
          <Box className="flex flex-col justify-center items-center gap-y-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
            <Link className="" to="/registration" component={RouterLink}>
              Non hai ancora un account?
            </Link>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Login;
