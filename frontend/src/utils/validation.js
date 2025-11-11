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

export { validateEmail, validatePassword }
