// src/context/ReportContext.js
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getReports } from "src/services/reportsService";

const ReportContext = createContext();

export function ReportProvider({ children, params = {} }) {
  const [allReports, setAllReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const sortReports = (reports) =>
    [...reports].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "OPEN" ? -1 : 1;
    });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReports(params);
      if (result.success) {
        setAllReports(sortReports(result.reports));
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

  const refreshReports = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      allReports,
      loading,
      error,
      refreshReports,
    }),
    [allReports, loading, error, refreshReports],
  );

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}

export default ReportContext;
