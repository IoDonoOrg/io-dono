// src/hooks/useReport.js
import { useState, useEffect, useCallback } from "react";
import { getReports } from "src/services/reportsService";
export function useReport(params = {}) {
  const [allReports, setAllReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReports(params);
      if (result.success) {
        setAllReports(result.reports);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Impossibile caricare le segnalazioni.");
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refreshReports = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    allReports,
    loading,
    error,
    refreshReports,
  };
}
