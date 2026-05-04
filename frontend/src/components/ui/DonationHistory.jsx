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
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";

function DonationHistory({ open, onClose }) {
  const { alertData, hideAlert } = useAlert();
  const { allDonations, loading } = useDonation();

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
            Storico Donazione
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box className="flex flex-col gap-4 py-2">
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !allDonations || allDonations.length === 0 ? (
              <Typography color="textSecondary" align="center">
                Non hai ancora effettuato donazioni.
              </Typography>
            ) : (
              allDonations.map((el) => <DonationBar donation={el} />)
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

export default DonationHistory;
