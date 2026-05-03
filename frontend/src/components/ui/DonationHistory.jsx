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
import { formatDate, isModifieble } from "src/utils/format";
import ViewDonationDialog from "./ViewDonationDialog";
import CreateDonationDialog from "../form/CreateDonationDialog";
import { useAlert } from "src/hooks/useAlert";
import { useAuth } from "src/hooks/useAuth";
import AlertSnack from "./AlertSnack";
import { useDonationActions } from "src/hooks/useDonationActions";

function DonationHistory({ open, onClose }) {
  const { user } = useAuth();
  const { alertData, hideAlert } = useAlert();
  const { allDonations, loading } = useDonation();
  const {
    handleDelete,
    handleAccept,
    editDialogOpen,
    editedDonation,
    handleEdit,
    handleCloseEditDialog,
    viewDialogOpen,
    selectedDonation,
    handleVisualize,
    handleCloseViewDialog,
  } = useDonationActions();

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
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
                  role={user?.role}
                  onDelete={() => handleDelete(el._id)}
                  onVisualize={() => handleVisualize(el)}
                  isModifieble={isModifieble(el.status)}
                  onEdit={() => handleEdit(el)}
                  onAccept={() => handleAccept(el._id)}
                >
                  {`ID: ${el._id.substring(0, 10)}, Data ritiro: ${formatDate(
                    el.pickupTime,
                  )}, Contenuti: ${el.items[0]?.name} ${
                    el.items[0]?.quantity
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
