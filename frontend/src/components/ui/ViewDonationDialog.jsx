// ViewDonationDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import DonationView from "./DonationView";

export default function ViewDonationDialog({ open, onClose, donation }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className="text-center" variant="h5" fontWeight="bold">
          Dettagli donazione
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <DonationView donation={donation} />
      </DialogContent>

      <DialogActions className="flex ">
        <Button onClick={onClose} variant="contained" color="error">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
