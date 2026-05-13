import { acceptDonation, deleteDonation } from "src/services/donationService";
import { useDonation } from "./useDonation";

import { useState } from "react";

export const useDonationActions = () => {
  const [openDialog, setOpenDialog] = useState(null);

  const { removeDonationLocally, updateDonationLocally } = useDonation();

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
      // TODO: aggiungere gli alert qua
      // alertSuccess(result.message);
      updateDonationLocally(result.donation);
    } else {
      // alertError(result.message);
    }
  }

  return {
    openDialog,
    setOpenDialog,
    handleDelete,
    handleAccept,
  };
}
