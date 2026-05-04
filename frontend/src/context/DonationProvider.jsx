// src/context/DonationContext.js
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getDonationsByStatus } from "src/services/donationService";
import { DONATION_STATUS } from "src/utils/constants";
import { acceptedEx, activeEx, completedEx } from "src/utils/exampleData";

const DonationContext = createContext();

const DEBUG_MODE = import.meta.env.VITE_DEBUG;

export function DonationProvider({ children }) {
  const [activeDonations, setActiveDonations] = useState(null);
  const [acceptedDonations, setAcceptedDonations] = useState(null);
  const [completedDonations, setCompletedDonations] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // combina tutti i tipi delle donazioni in un unico array
  // se almeno una parte non è definita => sarà un array vuoto
  const allDonations = useMemo(() => {
    return activeDonations && acceptedDonations && completedDonations
      ? activeDonations.concat(acceptedDonations, completedDonations)
      : [];
  }, [activeDonations, acceptedDonations, completedDonations]);

  // recupera le donazione dal backend
  const fetchActiveDonations = useCallback(async () => {
    // blocco che controlla se è definita la variabile di ambiente debug
    // se lo è => dati di esempio verranno utilizzati al posto di quelli di backend
    if (DEBUG_MODE == true) {
      setActiveDonations(activeEx);
      return;
    }

    setLoading(true);
    try {
      const result = await getDonationsByStatus(DONATION_STATUS.AVAILABLE);
      setActiveDonations(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare le donazioni attive.");
    } finally {
      setLoading(false);
    }
  }, []);

  // recupera le donazioni accettate dal backend
  const fetchAcceptedDonations = useCallback(async () => {
    if (DEBUG_MODE == true) {
      setAcceptedDonations(acceptedEx);
      return;
    }

    try {
      const result = await getDonationsByStatus(DONATION_STATUS.ACCEPTED);
      setAcceptedDonations(result);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // recupera le donazioni completate dal backend
  const fetchCompletedDonations = useCallback(async () => {
    if (DEBUG_MODE == true) {
      setCompletedDonations(completedEx);
      return;
    }

    try {
      const result = await getDonationsByStatus(DONATION_STATUS.COMPLETED);
      setCompletedDonations(result);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // recupera tutti tipi di donazioni in un colpo
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchActiveDonations(),
        fetchAcceptedDonations(),
        fetchCompletedDonations(),
      ]);
      setError(null);
    } catch (_) {
      setError("Impossibile caricare le donazioni.");
    } finally {
      setLoading(false);
    }
  }, [fetchActiveDonations, fetchAcceptedDonations, fetchCompletedDonations]);

  // recupera i dati dal backend appena viene modificato lo trigger
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations, refreshTrigger]);

  // aggiorna i dati della donazione cambiando il valore dello trigger
  const refreshDonations = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // aggiorna l'array locale
  const removeDonationLocally = (id) => {
    setActiveDonations((prev) => prev?.filter((d) => d._id !== id) || null);
    setAcceptedDonations((prev) => prev?.filter((d) => d._id !== id) || null);
    setCompletedDonations((prev) => prev?.filter((d) => d._id !== id) || null);
  };

  // aggiorna l'array locale per risparmiare delle chiamate sulla rete
  const updateDonationLocally = (updatedDonation) => {
    const update = (prev) =>
      prev?.map((d) => (d._id === updatedDonation._id ? updatedDonation : d)) ??
      null;

    setActiveDonations(update);
    setAcceptedDonations(update);
    setCompletedDonations(update);
  };

  return (
    <DonationContext.Provider
      value={{
        activeDonations,
        acceptedDonations,
        completedDonations,
        allDonations,
        loading,
        error,
        refreshDonations,
        removeDonationLocally,
        updateDonationLocally,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export default DonationContext;
