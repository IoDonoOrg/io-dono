import { TextField, Button, Container, Box, Link } from "@mui/material";

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import PasswordField from "src/components/PasswordField";

import { GoogleLogin } from "@react-oauth/google";
import {
  confirmPasswords,
  normalizeName,
  validateEmail,
  validateName,
  validatePassword,
} from "src/utils/validation";
import { localLogin } from "src/services/loginService";
import AlertSnack from "src/components/AlertSnack";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";

function Registration() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

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

    // normalizza il nome prima di validarlo
    const normalizedName = normalizeName(name);
    setName(normalizedName);

    const nameResult = validateName(normalizedName, false);
    setNameError(nameResult);

    // normalizza il cognome prima di validarlo
    const normalizedLastName = normalizeName(lastName);
    setLastName(normalizedLastName);

    const lastNameResult = validateName(normalizedLastName, true);
    setLastNameError(lastNameResult);

    const emailResult = validateEmail(email);
    setEmailError(emailResult);

    const passwordResult = validatePassword(password);
    setPasswordError(passwordResult);

    const confirmPasswordResult = confirmPasswords(password, confirmPassword);
    setConfirmPasswordError(confirmPasswordResult);

    if (
      nameResult ||
      lastNameResult ||
      emailResult ||
      passwordResult ||
      confirmPasswordResult
    )
      return;

    // console.log("La form è valida:", { email, password });

    // la funzione che fa la chiamata al backend fornendo gli la mail e password
    // se login è stato effettuato con successo --> rittorna una stringa vuota
    // altrimenti ritorna il messaggio d'errore passato successivamente ad un alert
    // const loginResult = await localLogin(email, password);

    // se la stringa loginResult non è vuota --> c'è stato un errore
    // --> notifica l'untente tramite un alert e ritorna
    // if (loginResult) {
    //   // se siamo qua allora il backend non ha autenticato l'utente
    //   // --> notifica l'utente
    //   console.log("error");
    //   alertError(loginResult);
    //   return;
    // } else {
    //   // se siamo qua allora la login è andata a buon fine --> notifica l'utente
    //   // e lo reindirizza alla home
    //   alertSuccess("Accesso effettuato con successo!");

    //   // TODO: setuppare la localstorage e globaluser
    //   // localStorage.setItem("token", loginResult.token);

    //   setTimeout(() => {
    //     // replace: true sostituice /login nel browser
    //     // così che l'utente non potrò tornare al login
    //     // cliccando la freccia del browser
    //     navigate("/", { replace: true });
    //   }, 1000); // introduce un ritardo di 1000ms (1s) per poter osservare la bellezza dell'alert
    // }
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
          maxWidth="sm"
          className="bg-white p-8 border-2 border-gray-100/35 rounded-lg shadow-md/15"
        >
          <Box>
            <div>
              <h1 className="text-2xl font-bold text-center mb-6">
                Registrazione
              </h1>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // !! converta la stringa in un booleano
                error={!!nameError}
                helperText={nameError}
              />
              <TextField
                fullWidth
                label="Cognome *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                // !! converta la stringa in un booleano
                error={!!lastNameError}
                helperText={lastNameError}
              />
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
              <PasswordField
                passwordValue={confirmPassword}
                onPasswordChange={setConfirmPassword}
                error={!!confirmPasswordError}
                errorText={confirmPasswordError}
                label="Conferma password *"
              />
              <TextField
                fullWidth
                label="Numero di telefono *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!phoneError}
                helperText={phoneError}
              />

              <TextField
                fullWidth
                label="Indirizzo *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!addressError}
                helperText={addressError}
              />
              <Button
                color="primary"
                type="submit"
                size="large"
                variant="contained"
              >
                Registrati
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

export default Registration;
