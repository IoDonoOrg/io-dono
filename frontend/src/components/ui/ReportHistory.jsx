import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ReportBar from "./ReportBar";
import { useReport } from "src/hooks/useReport";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";
import { useEffect } from "react";

function ReportHistory({ open, onClose }) {
  const { alertData, hideAlert } = useAlert();
  const { allReports, loading, refreshReports } = useReport();

  useEffect(() => {
    if (open) refreshReports();
  }, [open]);

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
        maxWidth="md"
      >
        <DialogTitle>
          <Typography
            className="text-center"
            variant="h5"
            gutterBottom
            fontWeight="bold"
          >
            Storico Segnalazioni
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box className="flex flex-col gap-4 py-2">
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !allReports || allReports.length === 0 ? (
              <Typography color="textSecondary" align="center">
                Non hai ancora effettuato segnalazioni.
              </Typography>
            ) : (
              allReports.map((el) => <ReportBar key={el._id} report={el} />)
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReportHistory;
