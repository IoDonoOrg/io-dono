import { useState, useEffect } from "react";
import { getAssociationReport } from "../services/statisticsService";

export const useStatistics = (open) => {
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [itemsReport, setItemsReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setLoading(true);
      const result = await getAssociationReport({
        fromDate: new Date(Date.now() - 2592e6).toISOString(),
        toDate: new Date(Date.now() + 2592e6).toISOString()
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
  }, [open]);

  return { weeklyReport, itemsReport, loading, error };
};
