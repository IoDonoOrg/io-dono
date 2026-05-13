import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import AlertSnack from "src/components/ui/AlertSnack";
import RegistrationForm from "src/components/form/RegistrationForm";
import { useAlert } from "src/hooks/useAlert";
import { USER_ROLE } from "src/utils/constants";

const FORM_ID = "create-assoc-form";

function CreateAssocDialog({ open, onClose }) {
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>

      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography className="text-center" variant="h5" fontWeight="bold">
            Crea nuova associazione
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <RegistrationForm
            alertSuccess={alertSuccess}
            alertError={alertError}
            onSubmitSuccess={onClose}
            formId={FORM_ID}
            submitLabel={null}
            userType={{ category: USER_ROLE.ASSOCIATION }}
          />
        </DialogContent>

        <DialogActions sx={{ gap: 1, justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="contained" color="error">
            Chiudi
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            variant="contained"
            color="primary"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateAssocDialog;
