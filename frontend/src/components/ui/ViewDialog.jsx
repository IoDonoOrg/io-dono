import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

// componente generico per displayare un child
function ViewDialog({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className="text-center" variant="h5" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions className="flex">
        <Button onClick={onClose} variant="contained" color="error">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewDialog;
