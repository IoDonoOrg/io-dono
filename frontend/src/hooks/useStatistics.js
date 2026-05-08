import { useState, useEffect } from "react";
import { getAssociationReport } from "../services/statisticsService";

// Questo hook si occupa di recuperare i dati statistici per un intervallo di date specificato
// e di gestire lo stato di caricamento e eventuali errori
export const useStatistics = (open, dateRange) => {
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [itemsReport, setItemsReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect che si attiva quando il componente viene aperto o quando cambia l'intervallo di date
  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setLoading(true);
      const result = await getAssociationReport({
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
      });
      if (result.success) {
        setWeeklyReport(result.weeklyReport);
        setItemsReport(result.itemsReport);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetch();
  }, [open, dateRange.fromDate, dateRange.toDate]);

  return { weeklyReport, itemsReport, loading, error };
};
