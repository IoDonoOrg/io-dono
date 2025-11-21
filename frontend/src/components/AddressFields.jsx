import { TextField, Grid, MenuItem } from "@mui/material";

const PROVINCES = ["TN"];

function AddressFields({ children, formData, handleChange, formErrors }) {
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
            value={formData.street}
            onChange={handleChange}
            placeholder="Via Roma"
            size="small"
            error={!!formErrors.streetError}
            helperText={formErrors.streetError}
          />
        </Grid>
        <Grid item size={2}>
          <TextField
            fullWidth
            label="N. *"
            name="civicNumber"
            value={formData.civicNumber}
            onChange={handleChange}
            placeholder="10"
            size="small"
            error={!!formErrors.civicNumberError}
            helperText={formErrors.civicNumberError}
          />
        </Grid>
        <Grid item size={10}>
          <TextField
            fullWidth
            label="Comune *"
            name="comune"
            value={formData.comune}
            onChange={handleChange}
            placeholder="Trento"
            size="small"
            error={!!formErrors.comuneError}
            helperText={formErrors.comuneError}
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
            value={formData.province}
            error={!!formErrors.provinceError}
            helperText={formErrors.provinceError}
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
