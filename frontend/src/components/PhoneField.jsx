import { TextField, InputAdornment } from "@mui/material";

function PhoneField({ value, onChange, error, helperText, size, label }) {
  const handleChange = (event) => {
    // Toglie dal campo tutto ciò che non è un numero
    const rawValue = event.target.value.replace(/\D/g, "");

    // Il campo non accetterà più di 10 cifre
    if (rawValue.length > 10) return;

    let formattedValue = rawValue;

    // automaticamente aggiungi spazi per aiutare l'utente
    // se ci sono più di 6 cifre --> aggiunge 2 spazi
    if (rawValue.length > 6) {
      formattedValue = `
        ${rawValue.slice(0, 3)} ${rawValue.slice(3,6)} ${rawValue.slice(6)}`
      ;
    }
    // se ci sono più di 3 cifre ma meno di 6 --> aggiungo uno spazio solo
    else if (rawValue.length > 3) {
      formattedValue = `${rawValue.slice(0, 3)} ${rawValue.slice(3)}`;
    }

    // 4. Send the formatted string back to the parent
    onChange(formattedValue);
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
