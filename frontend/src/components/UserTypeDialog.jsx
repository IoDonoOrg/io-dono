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
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  USER_CATEGORY,
  DONATOR_TYPE,
  validateUserType,
} from "src/utils/validation";

function UserTypeDialog({ onSubmit }) {
  const [open, setOpen] = useState(true);

  const [userType, setUserType] = useState({
    category: USER_CATEGORY.NO_CATEGORY,
    donatorType: DONATOR_TYPE.NO_TYPE,
  });

  const [error, setError] = useState({
    userCategory: "",
    donatorType: "",
  });

  const handleUserCategory = (e) => {
    let value = e.target.value;
    setUserType({ ...userType, category: value });
    setError({ ...error, userCategory: "" });
  };

  const handleDonatorType = (e) => {
    let value = e.target.value;

    setUserType({
      ...userType,
      donatorType: value,
    });

    setError({ ...error, donatorType: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(userType);

    const valdiationError = validateUserType(userType);

    setError({
      userCategory: valdiationError.userCategory,
      donatorType: valdiationError.donatorType,
    });

    if (!!valdiationError.userCategory || !!valdiationError.donatorType) return;

    setOpen(false);
    onSubmit(userType);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle color="red">Aspetta!</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4">
          <DialogContentText color="black" fontSize={17}>
            Prima di procedere con la registrazione devi specificare il tipo di
            utente che rappresenti
          </DialogContentText>
          <form onSubmit={handleSubmit} id="user-type-form">
            <FormControl error={!!error.userCategory}>
              <FormLabel id="radio-user-type">Rappresenti un..</FormLabel>
              <RadioGroup
                aria-labelledby="radio-user-type"
                defaultValue="female"
                name="radio-buttons-group"
                className="flex flex-col gap-2"
                onChange={handleUserCategory}
              >
                <FormControlLabel
                  value={USER_CATEGORY.DONATOR}
                  control={<Radio />}
                  label="Donatore privato"
                />
                {userType.category === USER_CATEGORY.DONATOR && (
                  <TextField
                    select
                    label="Tipo del donatore"
                    value={userType.donatorType}
                    onChange={handleDonatorType}
                    fullWidth
                    size="small"
                    error={!!error.donatorType}
                    helperText={error.donatorType}
                  >
                    <MenuItem value={DONATOR_TYPE.PRIVATE}>
                      Privato (Un individuo)
                    </MenuItem>
                    <MenuItem value={DONATOR_TYPE.COMMERCIAL}>
                      Commerciale (Un attività commericiale)
                    </MenuItem>
                  </TextField>
                )}
                <FormControlLabel
                  value={USER_CATEGORY.ASSOCIATION}
                  control={<Radio />}
                  label="Associazione"
                />
              </RadioGroup>
              {!!error.userCategory && (
                <FormHelperText>{error.userCategory}</FormHelperText>
              )}
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
