import { TextField, InputAdornment } from "@mui/material";

function PhoneField({ value, onChange, size, label, error, helperText }) {
  // lunghezza di numero di telefono senza prefisso e senza spazi
  const UNPREFIXED_NUMBER_LEN = 10;

  // la funzione che formatta il campo "Cellulare", aggiungendo degli spazi
  const formatPhone = (rawDigits) => {
    let formattedDigits = rawDigits;

    // automaticamente aggiungi spazi per aiutare l'utente
    // se ci sono più di 6 cifre --> aggiunge 2 spazi (dopo la 4 e 7 cifra)
    if (rawDigits.length > 6) {
      formattedDigits = `${rawDigits.slice(0, 3)} ${rawDigits.slice(
        3,
        6
      )} ${rawDigits.slice(6)}`;
    }
    // se ci sono più di 3 cifre ma meno di 6 --> aggiungo uno spazio solo (dopo la 4 cifra)
    else if (rawDigits.length > 3) {
      formattedDigits = `${rawDigits.slice(0, 3)} ${rawDigits.slice(3)}`;
    }

    return formattedDigits;
  };

  const handleChange = (event) => {
    // Toglie dal campo tutto ciò che non è un numero
    const rawDigits = event.target.value.replace(/\D/g, "");

    // Il campo non accetterà più di 10 cifre
    if (rawDigits.length > UNPREFIXED_NUMBER_LEN) return;

    // Aiuta l'utente aggiungendo spazi
    const formattedDigits = formatPhone(rawDigits);

    onChange(formattedDigits);
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      fullWidth
      size={size}
      placeholder="333 123 4567"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <div className="flex items-center">
                <span className="text-gray-500 font-medium">+39</span>
                <div className="h-5 w-px bg-gray-400 ml-2 mr-1"></div>
              </div>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default PhoneField;
