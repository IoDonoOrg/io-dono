import { DONATOR_TYPE, unformatPhoneNumber, USER_CATEGORY } from "src/utils/validation";
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
//       category: USER_CATEGORY.NO_CATEGORY,
//       donatorType: DONATOR_TYPE.NO_TYPE,
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
    user.category === USER_CATEGORY.DONATOR &&
    user.donatorType === DONATOR_TYPE.PRIVATE
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
    if (user.donatorType === DONATOR_TYPE.COMMERCIAL) {
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

