import React, { useState } from "react";
import { TextField, Grid, MenuItem } from "@mui/material";

// List of provinces (shortened example)
const PROVINCES = ["TN", "MI", "RM", "NA", "TO", "VE"];

function AddressForm() {
  // Single state object for cleaner management
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    street: "",
    civicNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form>
      {/* Use Grid container to create the layout */}
      <Grid container spacing={2}>
        {/* Row 1: Street (75%) + Civic Number (25%) */}
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Via / Piazza *"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Via Roma"
            size="small"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="N. *"
            name="civicNumber"
            value={formData.civicNumber}
            onChange={handleChange}
            placeholder="10"
            size="small"
          />
        </Grid>

        {/* Row 2: CAP (30%) + City (50%) + Province (20%) */}
        <Grid item xs={4} sm={3}>
          <TextField
            fullWidth
            label="CAP *"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="38122"
            size="small"
            inputProps={{ maxLength: 5 }} // Italian CAP is 5 digits
          />
        </Grid>
        <Grid item xs={8} sm={6}>
          <TextField
            fullWidth
            label="Comune *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Trento"
            size="small"
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddressForm;
