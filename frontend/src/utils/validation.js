import { DONOR_TYPE, USER_ROLE } from "./constants";

// se la stringa e vuota --> non ci sono errori
export const validateEmail = (email) => {
  let result = "";

  // controlla se la mail e vuota
  if (!email)
    result = "L'email è obbligatoria";

  // \S+ controlla se la parte utente (prima della @) non sia vuota
  // @ controlla se la stringa contiene una @
  // \S+ controlla se la parte dominio (appena dopo la @) non sia vuota
  // \. controlla se la stringa contiene un . (il backslash e neccessario perche altrimenti significa "qualsiasi carattere")
  // \S+ controlla se la parte tld (dopo il .) non sia vuota
  else if (!/\S+@\S+\.\S+/.test(email))
    result = "Indirizzo email non valido";

  return result;
}

// controlla la validita della password
// restituisce una stringa che rappresenta il messaggio d'errore
// se la stringa e vuota --> non ci sono errori
export const validatePassword = (password) => {
  let result = "";

  // controlla se la password e vuota
  if (!password)
    result = "La password è obbligatoria";

  // controlla se la lunghezza della password è almeno 8 caratteri
  else if (password.length < 8)
    result = "La password deve essere di almeno 8 caratteri";

  // controlla se la password contiene almeno una lettera maiuscola [A-Z].
  else if (!/[A-Z]/.test(password))
    result = "La password deve contenere almeno una lettera maiuscola";

  // controlla se la password contiene almeno un numero [0-9].
  else if (!/[0-9]/.test(password))
    result = "La password deve contenere almeno un numero";

  // controlla se la stringa contiene almeno un carattere speciale (tra quelli definiti)
  // !@#$%^&*(),.?":{}|<>
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    result = "La password deve contenere almeno un carattere speciale";

  return result;
}

export const confirmPasswords = (password, confirmPassword) => {
  if (!confirmPassword)
    return "Confermare la password è obbligatorio"
  return (password === confirmPassword) ? "" : "Le password non coincidono";
}

export const normalizeName = (name) => {
  const trimmed = name.trim().toLowerCase();

  if (!trimmed) return "";

  // splita la stringa sugli spazi e rende maiuscola ogni lettera che segue subito dopo uno spazio
  return trimmed
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


// aspetta un nome già normalizzato come parametro
export const validateName = (normalizedName, lastName) => {
  let result = "";
  const prefix = lastName ? "Il cognome" : "Il nome";

  if (!normalizedName)
    result = `${prefix} è obbligatorio`;

  else if (normalizedName.length < 2)
    result = `${prefix} è troppo corto`;

  else if (normalizedName.length > 20)
    result = `${prefix} è troppo lungo`;

  else if (/[^A-Za-zÀ-ÖØ-öø-ÿ'\s-]/.test(normalizedName))
    result = `${prefix} può contenere solo lettere`;

  return result;
};

export const unformatPhoneNumber = (phoneNumber) => {
  // tolgo gli spazi
  let unformattedPhoneNumber = phoneNumber?.split(" ").join("");

  // aggiungo anche il prefisso
  unformattedPhoneNumber = `+39${unformattedPhoneNumber}`;

  return unformattedPhoneNumber;
}

export const validatePhone = (phone) => {
  let result = "";

  const unformattedPhoneNumber = unformatPhoneNumber(phone);
  const formatted_length = 10;

  // console.log(unformattedPhoneNumber);

  if (!unformattedPhoneNumber)
    result = "Cellulare è obbligatorio";

  // +3 per considerare anche "+39"
  else if (unformattedPhoneNumber.length != formatted_length + 3)
    result = "Formato non valido";

  return result;
}

export const validateAddress = (addressData) => {
  let addressErrors = {
    street: "",
    civicNumber: "",
    comune: "",
    province: "",
  };

  if (!addressData.street)
    addressErrors.street = "La via è obbligatoria";

  if (!addressData.civicNumber)
    addressErrors.civicNumber = "Obbligatorio";

  if (!addressData.comune)
    addressErrors.comune = "Il comune è obbligatorio";

  return addressErrors;
};


// la funzione che valida il tipo di utenza
export const validateUserType = (user) => {
  // l'oggetto che contiene 2 possibili tipi di errori
  // userCategory -> l'utente non ha selezionato una categoria
  // donatorType -> l'utente ha selezionato la categoria donatore, 
  // ma non ha specificato il tipo di donatore che rappresenta
  let error = {
    userCategory: "",
    donatorType: ""
  };

  if (user.category === USER_ROLE.NO_CATEGORY)
    error.userCategory = "Selezionare il tipo di utenza è obbligatorio";

  if (
    user.category === USER_ROLE.DONOR &&
    user.donatorType === DONOR_TYPE.NO_TYPE
  )
    error.donatorType = "Selezionare il tipo di donatore è obbligatorio";

  // ritorna l'oggetto con testo degli errori
  // se un campo contiene stringa vuota -> non ci sono errori
  return error;
}

export const validateOpeningHours = (openingHours) => {
  let errors = {
    start: "",
    end: ""
  }

  if (!openingHours.start) errors.start = "Orario richiesto";
  if (!openingHours.end) errors.end = "Orario richiesto";

  if (!errors.start && !errors.end) {
    if (openingHours.start >= openingHours.end) {
      errors.start = "Deve essere prima della chiusura";
    }
  }

  return errors;
}

export const validatePickupTime = (dateValue) => {
  // Controlla se la data di ritiro è stata selezionata
  if (!dateValue) return "Data e ora di ritiro sono obbligatorie.";

  const selectedDate = new Date(dateValue);
  const now = new Date();

  // Sanity check: controlla che la data di ritoro sia nel futuro
  if (selectedDate <= now) return "La data di ritiro deve essere nel futuro.";

  return "";
};

export const validateItems = (items) => {
  // una donazione deve contenere almeno una riga
  if (!items || items.length === 0) {
    return "Aggiungi almeno un prodotto alla donazione.";
  }

  // controlla se tutti i prodotti aggiunti hanno:
  // 1. un nome prodotto
  // 2. una quantità 
  // 3. una quantità positiva
  const hasInvalidItems = items.some(
    (item) =>
      !item.type ||               // tipo obbligatoria
      !item.name.trim() ||        // nome obbligatorio
      !item.quantity ||           // quantità obbligatoria
      Number(item.quantity) <= 0  // quantità positiva
  );

  if (hasInvalidItems) {
    return "Compila il tipo, nome e quantità valida per tutti i prodotti";
  }

  return "";
};

// una nota non può contenere più di 500 caratteri
export const validateNotes = (notes) => {
  if (notes && notes.length > 500) {
    return "Le note non possono superare i 500 caratteri.";
  }
  return "";
};