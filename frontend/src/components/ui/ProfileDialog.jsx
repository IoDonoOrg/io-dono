import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Box } from "@mui/material";
import { DONOR_TYPE, USER_ROLE } from "src/utils/constants";

export default function UserProfileDialog({ open, onClose, user }) {
  if (!user) return null;

  const getNameLabel = (user) => {
    // console.log(user);
    if (
      user.role === USER_ROLE.DONOR &&
      user.donatorType === DONOR_TYPE.PRIVATE
    )
      return "Nome";
    else if (
      user.role === USER_ROLE.DONOR &&
      user.profile?.donorType === DONOR_TYPE.COMMERCIAL
    )
      return "Nome attività";
    else return "Nome associazione";
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-center items-center">
        Dettagli Profilo
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex justify-between items-center w-full mb-2">
          <Chip label={`Ruolo: ${user.role}`} color="primary" />
          <Chip
            label={`Punti Solidarietà: ${user.solidarityPoints}`}
            color="primary"
          />
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          className="px-2 mt-4"
          textAlign="start"
        >
          {[
            { label: getNameLabel(user), value: user.name },
            { label: "Email", value: user.email },
            { label: "Telefono", value: user.phoneNumber },
            { label: "Indirizzo", value: user.address },
            { label: "Tipo Donatore", value: user.profile?.donorType },
            { label: "Orari Apertura", value: user.profile?.commercialHours },
          ].map((field, index) => (
            <Grid item xs={12} md={4} key={index}>
              {field.value && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={field.sx}>
                    {field.value}
                  </Typography>
                </>
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
