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

function UserTypeDialog() {
  const [open, setOpen] = useState(true);

  const USER_CATEGORY = {
    DONATOR: "donator",
    ASSOCIATION: "association",
    NO_CATEGORY: "",
  };

  const DONATOR_TYPE = {
    PRIVATE: "private",
    COMMERCIAL: "commercial",
    NO_TYPE: "",
  };

  // const [userCategory, setUserCategory] = useState(USER_CATEGORY.NO_CATEGORY);
  // const [donatorType, setDonatorType] = useState(DONATOR_TYPE.NO_TYPE);

  const [userType, setUserType] = useState({
    category: USER_CATEGORY.NO_CATEGORY,
    donatorType: DONATOR_TYPE.NO_TYPE,
  });

  const [userCategoryError, setUserCategoryError] = useState("");
  const [donatorTypeError, setDonatorTypeError] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserCategory = (e) => {
    let value = e.target.value;
    setUserType({ ...userType, category: value });

    // sanity check
    // if (value != USER_CATEGORY.DONATOR)
    //   setUserType({ ...userType, donatorType: DONATOR_TYPE.NO_TYPE });
    setUserCategoryError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(userType);

    let isValid = true;

    if (userType.category === USER_CATEGORY.NO_CATEGORY) {
      setUserCategoryError("Selezionare il tipo di utenza è obbligatorio");
      isValid = false;
    }

    if (
      userType.category === USER_CATEGORY.DONATOR &&
      userType.donatorType === DONATOR_TYPE.NO_TYPE
    ) {
      setDonatorTypeError("Selezionare il tipo di donatore è obbligatorio");
      isValid = false;
    }

    if (isValid) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle color="red">Aspetta!</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4">
          <DialogContentText color="black" fontSize={16}>
            Prima di procedere con la registrazione devi specificare il tipo di
            utente che rappresenti
          </DialogContentText>
          <form onSubmit={handleSubmit} id="user-type-form">
            <FormControl error={!!userCategoryError}>
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
                    onChange={(e) =>
                      setUserType({
                        ...userType,
                        donatorType: e.target.value,
                      })
                    }
                    fullWidth
                    size="small"
                    error={!!donatorTypeError}
                    helperText={donatorTypeError}
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
              {!!userCategoryError && (
                <FormHelperText>{userCategoryError}</FormHelperText>
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
