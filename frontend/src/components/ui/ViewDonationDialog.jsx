// ViewDonationDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { formatDate, formatStatus } from "src/utils/format";

export default function ViewDonationDialog({ open, onClose, donation }) {
  console.log(donation);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className="text-center" variant="h5" fontWeight="bold">
          Dettagli donazione
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              ID
            </Typography>
            <Typography variant="body1">{donation._id}</Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1">
              {formatStatus(donation.status)}
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data creazione
            </Typography>
            <Typography variant="body1">
              {formatDate(donation.createdAt)}
            </Typography>
          </Grid>

          <Grid item size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data e Ora Ritiro
            </Typography>
            <Typography variant="body1">
              {formatDate(donation.pickupTime)}
            </Typography>
          </Grid>

          {donation.notes && (
            <Grid item size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Note
              </Typography>
              <Typography variant="body1">{donation.notes}</Typography>
            </Grid>
          )}

          <Grid item size={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Luogo di Ritiro
            </Typography>
            <Typography variant="body1">
              {donation.pickupLocation.address}
            </Typography>
          </Grid>

          <Grid item size={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Contenuti
            </Typography>
            {donation.items.map((item) => (
              <Typography key={item.id} variant="body1">
                {item.name} - {item.quantity} {item.units}
              </Typography>
            ))}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className="flex ">
        <Button onClick={onClose} variant="contained" color="error">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
