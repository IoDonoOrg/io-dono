import { useState } from "react";
import { confirmPasswords, DONATOR_TYPE, normalizeName, USER_CATEGORY, validateAddress, validateEmail, validateName, validatePassword, validatePhone } from "src/utils/validation";

export const useRegistration = () => {
  // address field è un componente speciale, perché gestisce i propri stati / errori
  // attraverso un hook customizzato useAddress, quindi non fa parte di formData o formErrors
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      civicNumber: "",
      comune: "",
      province: "TN",
    },
    user: {
      category: USER_CATEGORY.NO_CATEGORY,
      donatorType: DONATOR_TYPE.NO_TYPE,
    }
  });

  // non c'è campo user, perché gli errori relativi all'utente vengono gestiti dal 
  // dialogo UserTypeDialog
  const [formErrors, setFormErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      civicNumber: "",
      comune: "",
      province: "",
    }
  });

  // la funzione che passa su i dati dal componente-figlio UserTypeDialog
  // al componente Registration 
  const handleDialogSubmit = (userType) => {
    setFormData({ ...formData, user: userType });
    console.log(userType);
  };

  // la funzione che gestisce submit
  const handleSubmit = async (event) => {
    // non ricarica la pagina appena accade un evento (il comportamento di default)
    // così sfruttiamo il client side loading di React
    event.preventDefault();

    console.log(formData.user);

    // normalizza il nome / cognome prima di validarlo
    const normalizedName = normalizeName(formData.name);
    const normalizedLastName = normalizeName(formData.lastName);

    setFormData({
      ...formData,
      name: normalizedName,
      lastName: normalizedLastName,
    });

    const detectedErrors = {
      name: validateName(normalizedName, false),
      lastName: validateName(normalizedLastName, true),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: confirmPasswords(
        formData.password,
        formData.confirmPassword
      ),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address)
    };

    setFormErrors(detectedErrors);

    // scorre ogni campo
    // se almeno uno contiene una stringa non vuota --> hasErrors diventa true

    // .values() transforma l'oggeto detectedErrors in un array
    // .some() ritorna true se almeno un elemento soddisfa la condizone
    const hasErrors = Object.values(detectedErrors).some(
      (error) => error !== ""
    );

    if (hasErrors) return;

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

  const handleInputChange = (fieldName, val) => {
    setFormData({
      ...formData,
      [fieldName]: val,
    });
    setFormErrors({ ...formErrors, [fieldName]: "" });
  };

  return {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    handleDialogSubmit
  }
}