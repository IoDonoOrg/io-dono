import {
  TextField,
  Button,
  Container,
  Box,
  Link,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import PasswordField from "src/components/form/PasswordField";

import { GoogleLogin } from "@react-oauth/google";
import AlertSnack from "src/components/AlertSnack";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";
import PhoneField from "src/components/form/PhoneField";
import AddressFields from "src/components/form/AddressFields";
import OpeningHoursField from "src/components/form/OpeningHoursField";
import UserTypeDialog from "src/components/UserTypeDialog";
import { useRegistration } from "src/hooks/useRegistration";
import { USER_CATEGORY } from "src/utils/validation";

function Registration() {
  const {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    handleDialogSubmit,
  } = useRegistration();

  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    alertSuccess,
    alertError
  );

  return (
    <>
      <UserTypeDialog onSubmit={handleDialogSubmit} />
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
      <div className="min-h-screen flex items-center justify-center">
        <Container
          maxWidth="sm"
          className="bg-white p-4 border-2 border-gray-100/35 rounded-lg shadow-md/15 flex flex-col gap-2"
        >
          <Box>
            <Typography
              className="text-center"
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              Registrazione
            </Typography>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Box className="flex gap-2 pb-2 pt-2">
                <TextField
                  fullWidth
                  label="Nome *"
                  placeholder="Mario"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Cognome *"
                  placeholder="Rossi"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                label="Email *"
                placeholder="mariorossi@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                size="small"
              />
              <Box className="flex flex-row gap-2 pt-2 pb-2">
                <PasswordField
                  passwordValue={formData.password}
                  onPasswordChange={(val) => handleInputChange("password", val)}
                  error={!!formErrors.password}
                  errorText={formErrors.password}
                  label="Password *"
                  size="small"
                />
                <PasswordField
                  passwordValue={formData.confirmPassword}
                  onPasswordChange={(val) =>
                    handleInputChange("confirmPassword", val)
                  }
                  error={!!formErrors.confirmPassword}
                  errorText={formErrors.confirmPassword}
                  label="Conferma password *"
                  size="small"
                />
              </Box>
              <PhoneField
                value={formData.phone}
                onChange={(val) => handleInputChange("phone", val)}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                size="small"
                label="Cellulare *"
              />
              <AddressFields
                fieldName="Indirizzo"
                value={formData.address}
                onChange={(val) => handleInputChange("address", val)}
                errors={formErrors.address}
              />
              {formData.user.category === USER_CATEGORY.ASSOCIATION && (
                <OpeningHoursField
                  value={formData.openingHours}
                  errors={formErrors.openingHours}
                  fieldName="L'orario di apertura"
                  onChange={(val) => handleInputChange("openingHours", val)}
                />
              )}
              <Button
                color="primary"
                type="submit"
                size="large"
                variant="contained"
              >
                Registrati
              </Button>
            </form>
          </Box>
          <Box className="flex items-center gap-2 my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-600 text-sm">oppure</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </Box>
          <Box className="flex flex-col justify-center items-center gap-y-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
            <Link className="" to="/login" component={RouterLink}>
              Hai già un account?
            </Link>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Registration;
