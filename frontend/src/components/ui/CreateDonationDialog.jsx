import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import ProductsInput from "../form/ProductsInput";

import { DONATION_TYPES } from "src/utils/constants";

export default function CreateDonationDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    type: "",
    items: [{ id: Date.now(), quantity: "", product: "" }], // un array di oggetti
    pickupTime: null, // un oggetto
    notes: "",
    pickupLocation: null, // un oggetto
  });

  const [formErrors, setFormErrors] = useState({
    type: "",
    items: "",
    pickupTime: "",
    notes: "",
    pickupLocation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    onClose();
  };

  const handleInputChange = (fieldName, val) => {
    setFormData({
      ...formData,
      [fieldName]: val,
    });
    setFormErrors({ ...formErrors, [fieldName]: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography
          className="text-center"
          variant="h5"
          gutterBottom
          fontWeight="bold"
        >
          Nuova donazione
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={3}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                variant="outlined"
              >
                <MenuItem value={DONATION_TYPES.FOOD}>
                  {DONATION_TYPES.FOOD}
                </MenuItem>
                <MenuItem value={DONATION_TYPES.CLOTHING}>
                  {DONATION_TYPES.CLOTHING}
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item size={7}>
              <DateTimePicker
                label="Data e Ora Ritiro"
                value={formData.pickupTime}
                onChange={(val) => handleInputChange("pickupTime", val)}
                error={formErrors.pickupTime}
                disablePast
              />
            </Grid>
            <Grid item size={12}>
              <ProductsInput
                value={formData.items}
                onChange={(val) => handleInputChange("items", val)}
                error={formErrors.items}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="note"
                label="Note"
                placeholder="Aggiungi i dettagli dei prodotti donati o le istruzioni per il ritiro."
                value={formData.notes}
                error={!!formErrors.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: 2,
            paddingY: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            type="button"
          >
            Annulla
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Crea
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
