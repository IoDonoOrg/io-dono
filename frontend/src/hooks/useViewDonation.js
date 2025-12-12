import { useState } from "react";

export const useViewDonation = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const handleVisualize = (donation) => {
    setSelectedDonation(donation);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedDonation(null);
  };

  return {
    viewDialogOpen,
    selectedDonation,
    handleVisualize,
    handleCloseViewDialog
  }
}