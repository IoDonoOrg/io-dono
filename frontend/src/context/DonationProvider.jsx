// src/context/DonationContext.js
import { createContext, useState, useEffect, useCallback } from "react";
import { activeDonations } from "src/services/donationService";

const DonationContext = createContext();

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // The actual fetch logic
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await activeDonations();
      setDonations(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare le donazioni.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever trigger changes
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations, refreshTrigger]);

  // Function to call when we want to reload data
  const refreshDonations = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Optimistic update for deletions (optional but recommended)
  const removeDonationLocally = (id) => {
    setDonations((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        loading,
        error,
        refreshDonations,
        removeDonationLocally,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export default DonationContext;
