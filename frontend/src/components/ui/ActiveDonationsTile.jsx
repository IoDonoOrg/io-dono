import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";
function ActiveDonationsTile({ displayNumber = 3 }) {
  const { activeDonations, loading, error } = useDonation();
  const { alertData, hideAlert } = useAlert();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={100}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const displayedDonations = activeDonations
    ? activeDonations.slice(0, displayNumber)
    : [];
  // const displayedDonations = [];

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
      <Typography
        className="text-center"
        variant="h6"
        gutterBottom
        fontWeight="bold"
      >
        Donazioni Attive
      </Typography>
      <Box className="flex flex-col gap-4 py-2">
        {/* Donazioni attive */}
        {displayedDonations.length === 0 ? (
          <Typography color="textSecondary" align="center">
            Nessuna donazione attiva trovata.
          </Typography>
        ) : (
          displayedDonations.map((el) => <DonationBar donation={el} />)
        )}
      </Box>
    </>
  );
}

export default ActiveDonationsTile;
