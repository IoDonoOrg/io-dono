import { Container, Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import AlertSnack from "src/components/ui/AlertSnack";
import UserTypeDialog from "src/components/ui/UserTypeDialog";
import RegistrationForm from "src/components/form/RegistrationForm";
import { useGoogleAuth } from "src/hooks/useGoogleAuth";
import { useAlert } from "src/hooks/useAlert";
import { useRegistration } from "src/hooks/useRegistration";

function Registration() {
  const { alertData, alertSuccess, alertError, alertInfo, hideAlert } =
    useAlert();
  const { handleDialogSubmit, isGoogleMode } = useRegistration(
    alertSuccess,
    alertError,
  );
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    alertError,
    alertSuccess,
    alertInfo,
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
              className="text-center pb-2"
              variant="h5"
              gutterBottom
              fontWeight="bold"
            >
              {isGoogleMode ? "Registrazione Google" : "Registrazione"}
            </Typography>
            <RegistrationForm
              alertSuccess={alertSuccess}
              alertError={alertError}
            />
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
            <Link to="/login" component={RouterLink}>
              Hai già un account?
            </Link>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Registration;
