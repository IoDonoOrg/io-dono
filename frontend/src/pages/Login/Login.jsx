import { TextField, Button, Container, Box, Link } from "@mui/material";

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import PasswordField from "src/components/PasswordField";

import { GoogleLogin } from "@react-oauth/google";
import { validateEmail, validatePassword } from "src/utils/validation";
import { localLogin } from "src/services/loginService";
import AlertSnack from "src/components/AlertSnack";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // hook customizzati
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    alertSuccess,
    alertError
  );

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

    // la funzione che fa la chiamata al backend fornendo gli la mail e password
    // se login è stato effettuato con successo --> rittorna una stringa vuota
    // altrimenti ritorna il messaggio d'errore passato successivamente ad un alert
    const loginResult = await localLogin(email, password);

    // se la stringa loginResult non è vuota --> c'è stato un errore
    // --> notifica l'untente tramite un alert e ritorna
    if (loginResult) {
      // se siamo qua allora il backend non ha autenticato l'utente
      // --> notifica l'utente
      console.log("error");
      alertError(loginResult);
      return;
    } else {
      // se siamo qua allora la login è andata a buon fine --> notifica l'utente
      // e lo reindirizza alla home
      alertSuccess("Accesso effettuato con successo!");

      // TODO: setuppare la localstorage e globaluser
      // localStorage.setItem("token", loginResult.token);

      setTimeout(() => {
        // replace: true sostituice /login nel browser
        // così che l'utente non potrò tornare al login
        // cliccando la freccia del browser
        navigate("/", { replace: true });
      }, 1000); // introduce un ritardo di 1000ms (1s) per poter osservare la bellezza dell'alert
    }
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
            <div>
              <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            </div>
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
