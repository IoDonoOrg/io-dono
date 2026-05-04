import { acceptDonation, deleteDonation } from "src/services/donationService";
import { useDonation } from "./useDonation";

import { useState } from "react";

export const useDonationActions = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  const { removeDonationLocally, updateDonationLocally } = useDonation();

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleVisualize = () => {
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
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
    const result = await acceptDonation(id);

    if (result.success) {
      // alertSuccess(result.message);
      updateDonationLocally(result.donation);
    } else {
      // alertError(result.message);
    }
  }

  const handleComplete = async () => {
    setCompleteDialogOpen(true);
  };

  const handleCloseCompleteDialog = () => {
    setCompleteDialogOpen(false);
  };

  return {
    editDialogOpen,
    handleEdit,
    handleCloseEditDialog,
    viewDialogOpen,
    handleVisualize,
    handleCloseViewDialog,
    completeDialogOpen,
    handleCloseCompleteDialog,
    handleDelete,
    handleAccept,
    handleComplete,
  };

}