import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import ProductsInput from "./ProductsInput";
import { createDonation, updateDonation } from "src/services/donationService";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "../ui/AlertSnack";
import {
  validateItems,
  validateNotes,
  validatePickupLocation,
  validatePickupTime,
} from "src/utils/validation";
import { useDonation } from "src/hooks/useDonation";
import dayjs from "dayjs";
import { formatBackendQuantity, formatBackendUnits } from "src/utils/format";
import GoogleAutocomplete from "./GoogleAutocomplete";

export default function CreateDonationDialog({
  open,
  onClose,
  inEditMode = false,
  donation = null, // utile solo se in modalità edit
}) {
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();
  const { refreshDonations } = useDonation();

  const initialFormData = {
    type: "",
    items: [
      {
        id: Date.now(),
        type: "",
        name: "",
        quantity: "1",
        units: "kg",
      },
    ],
    pickupTime: null,
    notes: "",
    pickupLocation: null,
  };

  // dati del form
  const [formData, setFormData] = useState(initialFormData);

  // descrizione degli errori
  const [formErrors, setFormErrors] = useState({
    type: "",
    items: "",
    pickupTime: "",
    notes: "",
    pickupLocation: "",
  });

  // Effetto per popolare il form in modalità edit
  // Prende i dati recuperati dal backend e li prepara nel formato frontend
  useEffect(() => {
    if (inEditMode && donation && open) {
      setFormData({
        type: donation.type,
        items: donation.items.map((item) => ({
          id: item._id,
          type: item.type,
          name: item.name,
          // 2 funzioni helper che aiutano a formattare il campo quantity del backend
          // splittandolo in 2 sottocampi (quantità e unità)
          quantity: formatBackendQuantity(item),
          units: formatBackendUnits(item),
        })),
        pickupTime: dayjs(donation.pickupTime),
        notes: donation.notes,
        pickupLocation: donation.pickupLocation,
      });
    }
  }, [inEditMode, donation, open]);

  // funzione chiamata appena l'utente schiccia il buttone "Crea donazione"
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);

    const detectedErrors = {
      pickupTime: validatePickupTime(formData.pickupTime),
      items: validateItems(formData.items),
      notes: validateNotes(formData.notes),
      pickupLocation: validatePickupLocation(formData.pickupLocation),
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
    let result;

    console.log(formData);

    if (inEditMode && donation) {
      // Modalità modifica
      result = await updateDonation(donation._id, formData);
    } else {
      // Modalità creazione
      result = await createDonation(formData);
    }

    if (result.success) {
      alertSuccess(result.message);
      // aggiorna il context di DonationProvider
      refreshDonations();

      // risetta l'ui dopo che la creazione è andata a buon fine
      setFormData({
        type: "",
        items: [{ id: Date.now(), name: "", quantity: "1", units: "kg" }], // un array di oggetti
        pickupTime: null, // un oggetto
        notes: "",
        pickupLocation: null, // un oggetto
      });

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

  const handleAddressChange = (placeDetails) => {
    setFormData({
      ...formData,
      pickupLocation: placeDetails,
    });

    setFormErrors({
      ...formErrors,
      pickupLocation:
        placeDetails && !placeDetails.hasStreetNumber
          ? "Seleziona un indirizzo completo con numero civico"
          : "",
    });
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
              <Grid item size={6}>
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
              <Grid item size={6}>
                <GoogleAutocomplete
                  value={formData.pickupLocation}
                  onChange={handleAddressChange}
                  error={formErrors.pickupLocation}
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
              {inEditMode ? "Aggiorna" : "Crea"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
