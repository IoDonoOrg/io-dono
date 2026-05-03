import { acceptDonation, deleteDonation } from "src/services/donationService";
import { useDonation } from "./useDonation";
import { useAlert } from "./useAlert";

import { useState } from "react";

export const useDonationActions = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedDonation, setEditedDonation] = useState(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const { removeDonationLocally } = useDonation();
  const { alertSuccess, alertError } = useAlert();

  const handleEdit = (donation) => {
    setEditedDonation(donation);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditedDonation(null);
  };

  const handleVisualize = (donation) => {
    setSelectedDonation(donation);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedDonation(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id);
      removeDonationLocally(id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAccept = async (id) => {
    try {
      const result = await acceptDonation(id);
      if (result.success) {
        alertSuccess(result.message);
        removeDonationLocally(id);
      } else {
        alertError(result.message);
      }
    } catch (e) {
      console.log(e);
      alertError("Errore nell'accettazione della donazione");
    }
  };

  return {
    editDialogOpen,
    editedDonation,
    handleEdit,
    handleCloseEditDialog,
    viewDialogOpen,
    selectedDonation,
    handleVisualize,
    handleCloseViewDialog,
    handleDelete,
    handleAccept
  };

}