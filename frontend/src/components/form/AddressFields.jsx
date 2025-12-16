import { TextField, Grid, MenuItem, Typography } from "@mui/material";
import { PROVINCES } from "src/utils/constants";

function AddressFields({ fieldName, value, onChange, errors }) {
  // una funzione helper usata per aggiornare solo un campo dell'oggetto value
  const handleFieldChange = (fieldKey, newValue) => {
    // crea un nuovo oggetto con dati aggiornati
    const updatedAddress = {
      ...value,
      [fieldKey]: newValue,
    };

    // manda l'oggetto aggiornato al componente parent
    onChange(updatedAddress);
  };
  return (
    <>
      <Typography variant="body1" color="textSecondary">
        {fieldName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={10}>
          <TextField
            fullWidth
            label="Via / Piazza *"
            name="street"
            value={value.street}
            onChange={(e) => handleFieldChange("street", e.target.value)}
            placeholder="Via Roma"
            size="small"
            error={!!errors.street}
            helperText={errors.street}
          />
        </Grid>
        <Grid item size={2}>
          <TextField
            fullWidth
            label="N. *"
            name="civicNumber"
            value={value.civicNumber}
            onChange={(e) => handleFieldChange("civicNumber", e.target.value)}
            placeholder="10"
            size="small"
            error={!!errors.civicNumber}
            helperText={errors.civicNumber}
          />
        </Grid>
        <Grid item size={10}>
          <TextField
            fullWidth
            label="Comune *"
            name="comune"
            value={value.comune}
            onChange={(e) => handleFieldChange("comune", e.target.value)}
            placeholder="Trento"
            size="small"
            error={!!errors.comune}
            helperText={errors.comune}
          />
        </Grid>
        <Grid item size={2}>
          <TextField
            select
            disabled
            fullWidth
            label="Prov. *"
            name="province"
            onChange={(e) => handleFieldChange("province", e.target.value)}
            size="small"
            value={value.province}
            error={!!errors.province}
            helperText={errors.province}
          >
            {PROVINCES.map((prov) => (
              <MenuItem key={prov} value={prov}>
                {prov}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
}

export default AddressFields;
