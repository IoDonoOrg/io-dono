import { unformatPhoneNumber } from "src/utils/validation";
import { USER_ROLE, DONOR_TYPE } from "src/utils/constants";
import api from "./api";

// POST /api/auth/register
export const localRegistration = async (formData) => {
  // formatta i dati prima di inviarli
  const payload = preparePayload(formData);

  console.log(payload);

  try {
    const response = await api.post('/auth/register', payload);

    console.log('Registrazione effettuata con successo:', response.data);
    // una stringa vuota indica successo
    return "";

    // se c'è un'errore verrà restituita una stringa d'errore ricevuta dal backend
  } catch (err) {
    if (err.response) {
      console.error('Registrazione fallita:', err.response.data.message);
      return err.response.data.message;
    } else {
      console.error('Errore:', err.message);
      return err.message;
    }
  }
}

// {
//     name: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",

//     address: {
//       street: "",
//       civicNumber: "",
//       comune: "",
//       province: "TN",
//     },

//     openingHours: {
//       start: "09:00",
//       end: "18:00",
//     },

//     user: {
//       category: USER_ROLE.NO_CATEGORY,
//       donatorType: DONOR_TYPE.NO_TYPE,
//     }
// }

// una funzione helper che trasforma i dati del form
// nel formato aspettato dal backend 
const preparePayload = (data) => {
  const { user, address, openingHours } = data;

  const role = user.category;

  // formatta il campo nome
  // il campo contiene il nome di associazione / attività commerciale
  let finalName = data.name;

  // se l'utente è un donatore privato il campo nome è composto da nome + cognome
  if (
    user.category === USER_ROLE.DONOR &&
    user.donatorType === DONOR_TYPE.PRIVATE
  ) {
    finalName = `${data.name} ${data.lastName}`;
  }

  // formatta l'indirizzo in una stringa unica
  const addressString = `${address.street}, ${address.civicNumber}, ${address.comune}, ${address.province}`;

  // prepare l'oggetto profile
  const profile = {};

  if (role === 'DONOR') {
    profile.donorType = user.donatorType;

    // se l'utente rappresenta un'attività commerciale -> aggiunge l'orario
    if (user.donatorType === DONOR_TYPE.COMMERCIAL) {
      // Formato: "09:00-18:00"
      profile.commercialHours = `${openingHours.start}-${openingHours.end}`;
    }
  }

  // ritorna l'oggetto finale
  return {
    email: data.email,
    password: data.password,
    role: role,
    name: finalName,
    // chiama la funzione unformatPhoneNumber per ottenere il numero di telefono standard
    phoneNumber: unformatPhoneNumber(data.phone),
    address: addressString,
    profile: profile,
  };
};

export const googleRegistration = async (formData) => {
  const registrationToken = sessionStorage.getItem("registrationToken");

  if (!registrationToken) {
    return {
      success: false,
      message: "Sessione scaduta. Riprova il login con Google."
    };
  }

  // formatta i dati
  const payload = preparePayload(formData);

  console.log("Google Registration Payload:", payload);

  try {
    // È FONDAMENTALE aggiungere l'header Authorization manualmente qui
    // perché l'interceptor standard (definitio in api.js) cerca il token di login,
    // mentre qui serve quello di registrazione
    const response = await api.post('/auth/register-google', payload, {
      headers: {
        Authorization: `Bearer ${registrationToken}`
      }
    });

    console.log('Registrazione Google completata:', response.data);

    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    };

  } catch (err) {
    if (err.response) {
      console.error('Registrazione Google fallita:', err.response.data.message);
      return {
        success: false,
        message: err.response.data.message
      };
    } else {
      console.error('Errore:', err.message);
      return {
        success: false,
        message: err.message
      };
    }
  }
};

