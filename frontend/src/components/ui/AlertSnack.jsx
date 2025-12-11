import { Alert, Snackbar } from "@mui/material";

// attenzione: il componente dipende fortissimo dal genitore in cui verrà usato
// --> non ha stato interno, dipende completamente degli stati del genitore
function AlertSnack({ children, severity, open, onClose }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // chiama onClose solo se è stato fornito nei proprs
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: "10% !important" }}
      onClose={handleClose}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnack;
