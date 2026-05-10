import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import { validateUserType } from "src/utils/validation";
import { USER_ROLE, DONOR_TYPE } from "src/utils/constants";

function UserTypeDialog({ onSubmit }) {
  const [open, setOpen] = useState(true);

  // stato che rappresenta il tipo di donatore
  const [donatorType, setDonatorType] = useState(DONOR_TYPE.NO_TYPE);

  const [error, setError] = useState("");

  const handleDonatorType = (e) => {
    setDonatorType(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // chiama la funzione definita dentro utils/validation
    // per dettagli guardare la definizone
    const validationError = validateUserType(donatorType);
    setError(validationError);

    // se c'è stato rilevato almeno un error -> non chiude il dialogo
    if (validationError) return;

    setOpen(false);
    onSubmit({ category: USER_ROLE.DONOR, donatorType });
  };

  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="xs">
      <DialogTitle color="red">Aspetta!</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4">
          <DialogContentText color="textPrimary" fontSize={17}>
            Prima di procedere con la registrazione devi specificare il tipo di
            donatore che rappresenti
          </DialogContentText>
          <form onSubmit={handleSubmit} id="user-type-form">
            <FormControl error={!!error}>
              <FormLabel id="radio-donor-type" className="mb-3">
                Sei un donatore..
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-donor-type"
                name="radio-buttons-group"
                className="flex flex-col gap-1"
                onChange={handleDonatorType}
              >
                <FormControlLabel
                  value={DONOR_TYPE.PRIVATE}
                  control={<Radio />}
                  label="Privato (Un individuo)"
                />
                <FormControlLabel
                  value={DONOR_TYPE.COMMERCIAL}
                  control={<Radio />}
                  label="Commerciale (Un'attività commerciale)"
                />
              </RadioGroup>
              {!!error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="user-type-form">
          Procedi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserTypeDialog;
