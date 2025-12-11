import { useContext } from "react";
import DonationContext from "src/context/DonationProvider";

export const useDonation = () => {
  const context = useContext(DonationContext);

  if (!context)
    throw new Error("useDonation hook deve essere usato dentro il contesto di DonationProvider");

  return context;
};