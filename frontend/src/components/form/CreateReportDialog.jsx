import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  DialogTitle,
  Box,
} from "@mui/material";
import { formatReportType } from "src/utils/format";
import { createReport } from "src/services/reportsService";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "../ui/AlertSnack";
import { useAuth } from "src/hooks/useAuth";
// import { useReport } from "src/hooks/useReport";

function CreateReportDialog({ open, onClose, reportType }) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  // const { addReportLocally } = useReport();

  const { user } = useAuth();

  const { alertData, hideAlert, alertError, alertSuccess } = useAlert();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("La descrizione è obbligatoria");
      return;
    }
    // TODO: pensare qualcosa per l'user id con malfunzionamenti
    const result = await createReport(reportType, description, user._id);
    if (result.success) {
      // addReportLocally(result.report);
      resetForm();
      alertSuccess(result.message);
      return;
    }
    alertError(result.message);
  };

  const resetForm = () => {
    setDescription("");
    setError("");
    onClose();
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
      <Dialog open={open} onClose={resetForm} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography
            className="text-center"
            variant="h6"
            gutterBottom
            fontWeight="bold"
          >
            Segnalazione
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {"Tipo: "}
            </Box>
            {formatReportType(reportType)}
          </Typography>
          <TextField
            label="Descrizione"
            multiline
            rows={6}
            placeholder="Descrivi il problema"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError("");
            }}
            fullWidth
            error={Boolean(error)}
            helperText={error}
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1, justifyContent: "space-between" }}>
          <Button onClick={resetForm} variant="contained" color="error">
            Chiudi
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Crea
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateReportDialog;
