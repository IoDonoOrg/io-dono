// CloseReportDialog.jsx
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

function CloseReportDialog({ open, onClose, report }) {
  const [resolution, setResolution] = useState("");

  const handleSubmit = async () => {
    const result = await closeReport(report._id, resolution || null);
    if (result.success) {
      //TODO: aggiornate report localment
    }
    resetForm();
  };

  const resetForm = () => {
    setResolution("");
    onClose();
  };

  return (
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
  );
}

export default CloseReportDialog;
