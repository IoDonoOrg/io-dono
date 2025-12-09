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
import { createDonation } from "src/services/donationService";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";
import {
  validateDonationType,
  validateItems,
  validateNotes,
  validatePickupTime,
} from "src/utils/validation";

export default function CreateDonationDialog({ open, onClose }) {
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  // dati del form
  const [formData, setFormData] = useState({
    type: "",
    items: [{ id: Date.now(), product: "", quantity: "1", units: "kg" }], // un array di oggetti
    pickupTime: null, // un oggetto
    notes: "",
    pickupLocation: null, // un oggetto
  });

  // descrizione degli errori
  const [formErrors, setFormErrors] = useState({
    type: "",
    items: "",
    pickupTime: "",
    notes: "",
    pickupLocation: "",
  });

  // funzione chiamata appena l'utente schiccia il buttone "Crea donazione"
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    const detectedErrors = {
      type: validateDonationType(formData.type),
      pickupTime: validatePickupTime(formData.pickupTime),
      items: validateItems(formData.items),
      notes: validateNotes(formData.notes),
      pickupLocation: "",
    };

    setFormErrors(detectedErrors);

    // errors
    // IMPORTANTE: bisogna passare detectedErrors a hasErrors() e non formErrors
    // perché formErrors è uno stato React e viene aggiornato con il componente
    if (hasErrors(detectedErrors)) {
      console.log("Form invalido", detectedErrors);
      return;
    }

    // no errors
    const result = await createDonation(formData);

    if (result.success) {
      alertSuccess(result.message);
      onClose();
    }

    if (!result.success) alertError(result.message);
  };

  // scorre l'oggette formErrors
  // se almeno un campo non sia una stringa vuota --> ritorna true
  // altrimenti false
  const hasErrors = (errors) => {
    const errorsArray = Object.values(errors);
    const isError = errorsArray.some((value) => value != "");
    return isError;
  };

  // cambia il valore del campo fornito come il primo parametro
  const handleInputChange = (fieldName, val) => {
    // mantiene i campi già esistenti e modifica quello specificato
    // col valore nuovo
    setFormData({
      ...formData,
      [fieldName]: val,
    });

    // risetta gli errori appena l'utente interagisce con un campo
    setFormErrors({ ...formErrors, [fieldName]: "" });
  };

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
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
                  label="Tipo *"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  variant="outlined"
                  error={!!formErrors.type}
                  helperText={formErrors.type}
                >
                  <MenuItem value={DONATION_TYPES.FOOD}>
                    {DONATION_TYPES.FOOD}
                  </MenuItem>
                  <MenuItem value={DONATION_TYPES.CLOTHING}>
                    {DONATION_TYPES.CLOTHING}
                  </MenuItem>
                  <MenuItem value={DONATION_TYPES.MIXED}>
                    {DONATION_TYPES.MIXED}
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item size={7}>
                <DateTimePicker
                  label="Data e Ora Ritiro *"
                  value={formData.pickupTime}
                  onChange={(val) => handleInputChange("pickupTime", val)}
                  slotProps={{
                    textField: {
                      error: !!formErrors.pickupTime,
                      helperText: formErrors.pickupTime,
                    },
                  }}
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
                  placeholder="Aggiungi una descrizione dei prodotti donati o le istruzioni per ritiro."
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
    </>
  );
}
