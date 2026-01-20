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
import { useEditDonation } from "src/hooks/useEditDonation";
import CreateDonationDialog from "../form/CreateDonationDialog";

function ActiveDonationsTile({ displayNumber = 3 }) {
  const { activeDonations, loading, error, removeDonationLocally } =
    useDonation();

  const {
    viewDialogOpen,
    selectedDonation,
    handleVisualize,
    handleCloseViewDialog,
  } = useViewDonation();

  const { editDialogOpen, editedDonation, handleEdit, handleCloseEditDialog } =
    useEditDonation();

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
              onEdit={() => handleEdit(el)}
            >
              {`Ritiro: ${formatDate(el.pickupTime)} - ${el.items[0]?.name} ${
                el.items[0]?.quantity
              }, ...`}
            </DonationBar>
          ))
        )}
      </Box>
      {selectedDonation && (
        <ViewDonationDialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          donation={selectedDonation}
        />
      )}
      {editedDonation && (
        <CreateDonationDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          inEditMode={true}
          donation={editedDonation}
        />
      )}
    </>
  );
}

export default ActiveDonationsTile;
