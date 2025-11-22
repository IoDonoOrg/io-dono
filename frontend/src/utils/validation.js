// un oggetto tipo enum che rappresenta tutte possibili categorie di un utente
const USER_CATEGORY = {
  DONATOR: "donator",
  ASSOCIATION: "association",
  NO_CATEGORY: "",
};

// un oggetto tipo enum che rappresenta tutte possibili tipi di donatori
const DONATOR_TYPE = {
  PRIVATE: "private",
  COMMERCIAL: "commercial",
  NO_TYPE: "",
};


// controlla la validita dell'email
// restituisce una stringa che rappresenta il messaggio d'errore
// se la stringa e vuota --> non ci sono errori
const validateEmail = (email) => {
  let result = "";

  // controlla se la mail e vuota
  if (!email)
    result = "L'email è obligatoria";

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
const validatePassword = (password) => {
  let result = "";

  // controlla se la password e vuota
  if (!password)
    result = "La password è obligatoria";

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

const confirmPasswords = (password, confirmPassword) => {
  if (!confirmPassword)
    return "Confermare la password è obligatorio"
  return (password === confirmPassword) ? "" : "Le password non coincidono";
}

const normalizeName = (name) => {
  const trimmed = name.trim().toLowerCase();

  if (!trimmed) return "";

  // splita la stringa sugli spazi e rende maiuscola ogni lettera che segue subito dopo uno spazio
  return trimmed
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


// aspetta un nome già normalizzato come parametro
const validateName = (normalizedName, lastName) => {
  let result = "";
  const prefix = lastName ? "Il cognome" : "Il nome";

  if (!normalizedName)
    result = `${prefix} è obligatorio`;

  else if (normalizedName.length < 2)
    result = `${prefix} è troppo corto`;

  else if (normalizedName.length > 20)
    result = `${prefix} è troppo lungo`;

  else if (/[^A-Za-zÀ-ÖØ-öø-ÿ'\s-]/.test(normalizedName))
    result = `${prefix} può contenere solo lettere`;

  return result;
};

const unformatPhoneNumber = (phoneNumber) => {
  // tolgo gli spazi
  let unformattedPhoneNumber = phoneNumber?.split(" ").join("");

  // aggiungo anche il prefisso
  unformattedPhoneNumber = `+39${unformattedPhoneNumber}`;

  return unformattedPhoneNumber;
}

const validatePhone = (phone) => {
  let result = "";

  const unformattedPhoneNumber = unformatPhoneNumber(phone);
  const formatted_length = 10;

  console.log(unformattedPhoneNumber);

  if (!unformattedPhoneNumber)
    result = "Cellulare è obligatorio";

  // +3 per considerare anche "+39"
  else if (unformattedPhoneNumber.length != formatted_length + 3)
    result = "Formato non valido";

  return result;
}

// la funzione che valida il tipo di utenza
const validateUserType = (user) => {
  // l'oggetto che contiene 2 possibili tipi di errori
  // userCategory -> l'utente non ha selezionato una categoria
  // donatorType -> l'utente ha selezionato la categoria donatore, 
  // ma non ha specificato il tipo di donatore che rappresenta
  let error = {
    userCategory: "",
    donatorType: ""
  };

  if (user.category === USER_CATEGORY.NO_CATEGORY)
    error.userCategory = "Selezionare il tipo di utenza è obbligatorio";

  if (
    user.category === USER_CATEGORY.DONATOR &&
    user.donatorType === DONATOR_TYPE.NO_TYPE
  )
    error.donatorType = "Selezionare il tipo di donatore è obbligatorio";

  // ritorna l'oggetto con testo degli errori
  // se un campo contiene stringa vuota -> non ci sono errori
  return error;
}

export { USER_CATEGORY, DONATOR_TYPE, validateName, normalizeName, validateEmail, validatePassword, confirmPasswords, validatePhone, unformatPhoneNumber, validateUserType }
