import { useState } from "react";

export const useEditDonation = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedDonation, setEditedDonation] = useState(null);

  const handleEdit = (donation) => {
    setEditedDonation(donation);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditedDonation(null);
  };

  return {
    editDialogOpen,
    editedDonation,
    handleEdit,
    handleCloseEditDialog,
  };
};