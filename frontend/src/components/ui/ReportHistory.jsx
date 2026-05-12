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
import { useEffect, useMemo } from "react";

function ReportHistory({
  open,
  onClose,
  title = "Storico Segnalazioni",
  isAdmin = false,
}) {
  const { alertData, hideAlert } = useAlert();

  const hookProps = useMemo(
    () => ({
      scope: isAdmin ? "all" : "me",
    }),
    [isAdmin],
  );
  const { allReports, loading, refreshReports } = useReport(hookProps);

  // console.log(isAdmin);

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
            {title}
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
                {isAdmin
                  ? "Non ci sono segnalazioni attive"
                  : "Non hai ancora effettuato segnalazioni."}
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
