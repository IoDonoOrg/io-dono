import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleRegistration, localRegistration } from "src/services/registrationService";
import { confirmPasswords, normalizeName, validateAddress, validateEmail, validateName, validateOpeningHours, validatePassword, validatePhone } from "src/utils/validation";
import { USER_ROLE, DONOR_TYPE } from "src/utils/constants"
import { useAuth } from "./useAuth";

export const useRegistration = (alertSuccess, alertError) => {
  // flag che segnalizza che l'utente sta cercando di registrarsi tramite google
  const isGoogleMode = !!sessionStorage.getItem("registrationToken");
  console.log("Google mode: ", isGoogleMode);

  const { login } = useAuth();

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

    openingHours: {
      start: "09:00",
      end: "18:00",
    },

    user: {
      category: USER_ROLE.NO_CATEGORY,
      donatorType: DONOR_TYPE.NO_TYPE,
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
    },
    openingHours: {
      start: "",
      end: ""
    }
  });

  // la funzione che passa su i dati dal componente-figlio UserTypeDialog
  // al componente Registration 
  const handleDialogSubmit = (userType) => {
    setFormData({ ...formData, user: userType });
    console.log(userType);
  };

  const navigate = useNavigate();

  // la funzione che gestisce submit
  const handleSubmit = async (event) => {
    // non ricarica la pagina appena accade un evento (il comportamento di default)
    // così sfruttiamo il client side loading di React
    event.preventDefault();

    // console.log(formData.user);

    // normalizza il nome / cognome prima di validarlo
    const normalizedName = normalizeName(formData.name);
    const normalizedLastName = normalizeName(formData.lastName);

    const isPrivateDonator =
      formData.user.category === USER_ROLE.DONOR &&
      formData.user.donatorType === DONOR_TYPE.PRIVATE;

    setFormData({
      ...formData,
      name: normalizedName,
      lastName: normalizedLastName,
    });

    const detectedErrors = {
      name: validateName(normalizedName, false),
      // se l'utente è un donatore privato -> controlla il congome
      // altrimenti non valiada il campo
      lastName: isPrivateDonator ? validateName(normalizedLastName, true) : "",
      email: isGoogleMode ? "" : validateEmail(formData.email),
      password: isGoogleMode ? "" : validatePassword(formData.password),
      confirmPassword: isGoogleMode ? "" : confirmPasswords(
        formData.password,
        formData.confirmPassword
      ),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      openingHours: validateOpeningHours(formData.openingHours)
    };

    setFormErrors(detectedErrors);

    const hasErrors = checkFormErrors(detectedErrors);

    if (hasErrors) {
      console.log("Errore", detectedErrors);
      return;
    }

    // console.log("La form è valida ", formData);

    // restituisce una stringa vuota se non ci sono errori nel backend
    // altrimenti restituisce una stringa d'errore
    let result;

    if (isGoogleMode)
      result = await googleRegistration(formData);
    else
      result = await localRegistration(formData);

    // --- registrazione locale
    if (!isGoogleMode) {
      if (result)
        alertError(result);
      else {
        alertSuccess("Registrazione effettuata con successo! Ora puoi accedere.");
        // naviga l'utente alla pagina di login
        setTimeout(() => navigate('/login'), 2000);
      }
      return;
    }

    // --- registrazione google
    if (result.success) {
      sessionStorage.removeItem("registrationToken");
      login(result.token, result.user);
      alertSuccess("Registrazione completata! Benvenuto.");

      // naviga l'utente alla pagina Home
      setTimeout(() => navigate('/', { replace: true }), 1000);
    } else {
      alertError(result.message || "Errore durante la registrazione Google.");
    }
  };
  // funzione helper che scorre l'oggetto composto che contiene sia 
  // elementi del tipo key -> string
  // che elemeneti del tipo key -> object
  const checkFormErrors = (errors) => {
    // .values() transforma l'oggeto errors in un array
    const errors_array = Object.values(errors);

    // scorre ogni elemento dell'arra
    for (const val of errors_array) {
      // se l'elemento è una stringa ed non è vuoto -> c'è un errore -> ritorna true
      if (typeof val === "string" && val !== "") return true;

      // invece, se l'elemento è un ogggetto -> chiama ricorsivamente se stesso sull'oggetto
      if (val && typeof val === "object" && checkFormErrors(val)) return true;
    }

    // se non sono stati trovati degli errori -> ritorna false
    return false;
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
    handleDialogSubmit,
    isGoogleMode
  }
}