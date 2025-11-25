import { TextField, Grid, MenuItem } from "@mui/material";

const PROVINCES = ["TN"];

function AddressFields({ children, addressData, addressErrors, handleChange }) {
  return (
    <>
      <div>
        <h1 className="text-gray-500">{children}</h1>
      </div>
      <Grid container spacing={2}>
        <Grid item size={10}>
          <TextField
            fullWidth
            label="Via / Piazza *"
            name="street"
            value={addressData.street}
            onChange={handleChange}
            placeholder="Via Roma"
            size="small"
            error={!!addressErrors.street}
            helperText={addressErrors.street}
          />
        </Grid>
        <Grid item size={2}>
          <TextField
            fullWidth
            label="N. *"
            name="civicNumber"
            value={addressData.civicNumber}
            onChange={handleChange}
            placeholder="10"
            size="small"
            error={!!addressErrors.civicNumber}
            helperText={addressErrors.civicNumber}
          />
        </Grid>
        <Grid item size={10}>
          <TextField
            fullWidth
            label="Comune *"
            name="comune"
            value={addressData.comune}
            onChange={handleChange}
            placeholder="Trento"
            size="small"
            error={!!addressErrors.comune}
            helperText={addressErrors.comune}
          />
        </Grid>
        <Grid item size={2}>
          <TextField
            select
            disabled
            fullWidth
            label="Prov. *"
            name="province"
            onChange={handleChange}
            size="small"
            value={addressData.province}
            error={!!addressErrors.province}
            helperText={addressErrors.province}
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
