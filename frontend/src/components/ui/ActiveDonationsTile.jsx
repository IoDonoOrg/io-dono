import { Box, CircularProgress, Typography } from "@mui/material";
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { deleteDonation } from "src/services/donationService";
import dayjs from "dayjs";

function ActiveDonationsTile({ displayNumber = 3 }) {
  const { donations, loading, error, removeDonationLocally } = useDonation();

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id);
      // Chiamata alla funzione dell'hook useDonation che aggiorna il context
      removeDonationLocally(id);
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (dateString) => {
    const date = dayjs(dateString);
    // Format: "11 dic 2025, 23:00"
    // D = Day of month
    // MMM = Short month name
    // YYYY = Full year
    // HH:mm = 24h time
    return date.format("D MMM YYYY, HH:mm");
  };

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

  const displayedDonations = donations ? donations.slice(0, displayNumber) : [];
  // const displayedDonations = [];

  return (
    <>
      <Typography
        className="text-center"
        variant="h6"
        gutterBottom
        fontWeight="bold"
      >
        Donazioni Attive
      </Typography>
      <Box className="flex flex-col gap-4 py-2">
        {displayedDonations.length === 0 ? (
          <Typography color="textSecondary" align="center">
            Nessuna donazione attiva trovata.
          </Typography>
        ) : (
          displayedDonations.map((el) => (
            <DonationBar
              key={el._id}
              status={el.status}
              onDelete={() => handleDelete(el._id)}
            >
              {`Ritiro: ${formatDate(el.pickupTime)} ${el.quantity}`}
            </DonationBar>
          ))
        )}
      </Box>
    </>
  );
}

export default ActiveDonationsTile;
