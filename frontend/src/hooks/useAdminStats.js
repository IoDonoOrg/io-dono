import { useState, useEffect } from "react";
import { getDonationsTrend, getOverview } from "src/services/adminService";

export const useAdminStats = (open, dateRange) => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);

      const [overviewRes, trendRes] = await Promise.all([
        getOverview(),
        getDonationsTrend({
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate
        })
      ]);

      if (!overviewRes.success) {
        setError(overviewRes.message);
        setLoading(false);
        return;
      }

      if (!trendRes.success) {
        setError(trendRes.message);
        setLoading(false);
        return;
      }

      setOverview(overviewRes.overview);
      setTrend(trendRes.trend);
      setLoading(false);
    };

    fetch();
  }, [open, dateRange.fromDate, dateRange.toDate]);

  return { overview, trend, loading, error };
};
