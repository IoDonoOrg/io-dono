import { Grid, Typography } from "@mui/material";

function UserView({ user }) {
  if (!user)
    return <Typography color="text.secondary">Utente non trovato</Typography>;

  return (
    <Grid container spacing={1}>
      <Grid item size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          ID
        </Typography>
        <Typography variant="body1">{user._id}</Typography>
      </Grid>
      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Nome
        </Typography>
        <Typography variant="body1">{user.name}</Typography>
      </Grid>
      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Grid>
    </Grid>
  );
}

export default UserView;
