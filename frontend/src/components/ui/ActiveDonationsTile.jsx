import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import DonationBar from "./DonationBar";
import { useDonation } from "src/hooks/useDonation";
import { formatDate } from "src/utils/format";
import ViewDonationDialog from "./ViewDonationDialog";
import CreateDonationDialog from "../form/CreateDonationDialog";
import { useAuth } from "src/hooks/useAuth";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";
import { useDonationActions } from "src/hooks/useDonationActions";
function ActiveDonationsTile({ displayNumber = 3 }) {
  const { activeDonations, loading, error } = useDonation();
  const { user } = useAuth();
  const { alertData, hideAlert } = useAlert();

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
          displayedDonations.map((el) => (
            <DonationBar
              key={el._id}
              status={el.status}
              role={user?.role}
              onDelete={() => handleDelete(el._id)}
              onVisualize={() => handleVisualize(el)}
              onEdit={() => handleEdit(el)}
              onAccept={() => handleAccept(el._id)}
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
