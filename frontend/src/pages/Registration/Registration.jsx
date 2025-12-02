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
import AlertSnack from "src/components/ui/AlertSnack";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";
import PhoneField from "src/components/form/PhoneField";
import AddressFields from "src/components/form/AddressFields";
import OpeningHoursField from "src/components/form/OpeningHoursField";
import UserTypeDialog from "src/components/ui/UserTypeDialog";
import { useRegistration } from "src/hooks/useRegistration";
import { DONOR_TYPE, USER_ROLE } from "src/utils/constants";

function Registration() {
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  const {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    handleDialogSubmit,
    isGoogleMode,
  } = useRegistration(alertSuccess, alertError);

  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    alertSuccess,
    alertError
  );

  const handleNameLabel = (user) => {
    if (
      user.category === USER_ROLE.DONOR &&
      user.donatorType === DONOR_TYPE.PRIVATE
    )
      return "Nome *";
    else if (
      user.category === USER_ROLE.DONOR &&
      user.donatorType === DONOR_TYPE.COMMERCIAL
    )
      return "Nome attività commerciale *";
    else return "Nome associazione *";
  };

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
              className="text-center pb-2"
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              {isGoogleMode ? "Registrazione Google" : "Registrazione"}
            </Typography>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Box className="flex gap-2 pt-2">
                <TextField
                  fullWidth
                  label={handleNameLabel(formData.user)}
                  placeholder={
                    formData.user.category === USER_ROLE.DONOR &&
                    formData.user.donatorType === DONOR_TYPE.PRIVATE
                      ? "Mario"
                      : "Mulino Bianco"
                  }
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  size="small"
                />
                {formData.user.category === USER_ROLE.DONOR &&
                  formData.user.donatorType === DONOR_TYPE.PRIVATE && (
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
                  )}
              </Box>
              {!isGoogleMode && (
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
              )}
              {!isGoogleMode && (
                <Box className="flex flex-row gap-2 pt-2 pb-2">
                  <PasswordField
                    passwordValue={formData.password}
                    onPasswordChange={(val) =>
                      handleInputChange("password", val)
                    }
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
              )}
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
              {formData.user.donatorType === DONOR_TYPE.COMMERCIAL && (
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
            {!isGoogleMode && (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            )}
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
