import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import ReportView from "../ui/ReportView";
import { closeReport } from "src/services/reportsService";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "../ui/AlertSnack";
import { useReport } from "src/hooks/useReport";

function CloseReportDialog({ open, onClose, report }) {
  const [resolution, setResolution] = useState("");

  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  const { refreshReports } = useReport();

  const handleSubmit = async () => {
    const result = await closeReport(report._id, resolution || null);
    console.log("closeReport result:", result);
    if (result.success) {
      refreshReports();
      resetForm();
      alertSuccess(result.message);
      return;
    }

    alertError(result.message);
    resetForm();
  };

  const resetForm = () => {
    setResolution("");
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
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <ReportView report={report} />
          <TextField
            label="Risoluzione (opzionale)"
            multiline
            rows={4}
            placeholder="Aggiungi una descrizione della risoluzione..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1, justifyContent: "space-between" }}>
          <Button onClick={resetForm} variant="contained" color="error">
            Chiudi
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CloseReportDialog;
