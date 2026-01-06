import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { deleteDonation } from "src/services/donationService";
import { formatDate, isModifieble } from "src/utils/format";
import ViewDonationDialog from "./ViewDonationDialog";
import { useViewDonation } from "src/hooks/useViewDonation";
import { useEditDonation } from "src/hooks/useEditDonation";
import CreateDonationDialog from "../form/CreateDonationDialog";

function DonationHistory({ open, onClose }) {
  const {
    activeDonations,
    acceptedDonations,
    completedDonations,
    removeDonationLocally,
    loading,
  } = useDonation();

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
      removeDonationLocally(id);
    } catch (e) {
      console.log(e);
    }
  };

  // combina tutti i tipi delle donazioni in un unico array
  // se almeno una parte non è definita => sarà un array vuoto
  const allDonations =
    activeDonations && acceptedDonations && completedDonations
      ? activeDonations.concat(acceptedDonations, completedDonations)
      : [];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="paper"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography
            className="text-center"
            variant="h5"
            gutterBottom
            fontWeight="bold"
          >
            Storico Donazione
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box className="flex flex-col gap-4 py-2">
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !allDonations || allDonations.length === 0 ? (
              <Typography color="textSecondary" align="center">
                Non hai ancora effettuato donazioni.
              </Typography>
            ) : (
              allDonations.map((el) => (
                <DonationBar
                  key={el._id}
                  status={el.status}
                  onDelete={() => handleDelete(el._id)}
                  onVisualize={() => handleVisualize(el)}
                  isModifieble={isModifieble(el.status)}
                  onEdit={() => handleEdit(el)}
                >
                  {`Ritiro: ${formatDate(el.pickupTime)}, ${
                    el.items[0]?.name
                  }, ...`}
                </DonationBar>
              ))
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
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

export default DonationHistory;
