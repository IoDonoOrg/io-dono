// controlla la validita dell'email
// restituisce una stringa che rappresenta il messaggio d'errore
// se la stringa e vuota --> non ci sono errori
const validateEmail = (email) => {
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
const validatePassword = (password) => {
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
    result = `${prefix} è obbligatorio`;

  else if (normalizedName.length < 2)
    result = `${prefix} è troppo corto`;

  else if (normalizedName.length > 20)
    result = `${prefix} è troppo lungo`;

  else if (/\d/.test(normalizedName))
    result = `${prefix} non può contenere numeri`;

  else if (/[^A-Za-zÀ-ÖØ-öø-ÿ'\s-]/.test(normalizedName))
    result = `${prefix} non può contenere caratteri speciali`;

  return result;
};

export { validateName, normalizeName, validateEmail, validatePassword, confirmPasswords }
