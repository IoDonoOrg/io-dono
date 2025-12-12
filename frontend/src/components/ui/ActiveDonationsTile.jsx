import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { deleteDonation } from "src/services/donationService";
import { MoreHoriz } from "@mui/icons-material";
import { formatDate } from "src/utils/format";
import { useViewDonation } from "src/hooks/useViewDonation";
import ViewDonationDialog from "./ViewDonationDialog";

function ActiveDonationsTile({ displayNumber = 3, onOpenHistory }) {
  const { activeDonations, loading, error, removeDonationLocally } =
    useDonation();

  const {
    viewDialogOpen,
    selectedDonation,
    handleVisualize,
    handleCloseViewDialog,
  } = useViewDonation();

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id);
      // Chiamata alla funzione dell'hook useDonation che aggiorna il context
      removeDonationLocally(id);
    } catch (e) {
      console.log(e);
    }
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

  const displayedDonations = activeDonations
    ? activeDonations.slice(0, displayNumber)
    : [];
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
        {/* Donazioni attive */}
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
              onVisualize={() => handleVisualize(el)}
            >
              {`Ritiro: ${formatDate(el.pickupTime)} - ${
                el.items[0]?.name
              }, ...`}
            </DonationBar>
          ))
        )}
        {/* Tre puntini orizzontali */}
        <Paper
          variant="outlined"
          className="flex items-center justify-center px-4 py-1"
          sx={{
            borderRadius: 50,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="settings"
            onClick={onOpenHistory}
            aria-controls={open ? "donation-menu" : undefined}
            aria-haspopup="true"
          >
            <MoreHoriz />
          </IconButton>
        </Paper>
      </Box>
      {selectedDonation && (
        <ViewDonationDialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          donation={selectedDonation}
        />
      )}
    </>
  );
}

export default ActiveDonationsTile;
