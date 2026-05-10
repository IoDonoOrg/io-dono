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

const ASSOC_USER_OVERRIDES = { category: USER_ROLE.ASSOCIATION };
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
          <Typography
            className="text-center"
            variant="h5"
            gutterBottom
            fontWeight="bold"
          >
            Crea nuova associazione
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <RegistrationForm
            alertSuccess={alertSuccess}
            alertError={alertError}
            initialUserOverrides={ASSOC_USER_OVERRIDES}
            onSubmitSuccess={onClose}
            formId={FORM_ID}
            submitLabel={null}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Annulla
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            variant="contained"
            color="primary"
          >
            Crea associazione
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateAssocDialog;
