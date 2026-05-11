// ViewReportDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import ReportView from "./ReportView";

export default function ViewReportDialog({ open, onClose, report }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className="text-center" variant="h5" fontWeight="bold">
          Dettagli segnalazione
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <ReportView report={report} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
