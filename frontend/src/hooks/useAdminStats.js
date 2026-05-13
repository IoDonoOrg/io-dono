import { useState, useEffect } from "react";
import { STATS_COLORS } from "src/utils/statsUtility";
import { getDonationsTrend, getOverview } from "src/services/adminService";

export const useAdminStats = (open, dateRange) => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState(null);

  const [donationByCategory, setDonationByCategory] = useState([]);
  const [reportByStatus, setReportByStatus] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);
  const [trendData, setTrendData] = useState([]);

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
          toDate: dateRange.toDate,
        }),
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

      const ov = overviewRes.overview;
      const tr = trendRes.trend;

      setOverview(ov);
      setTrend(tr);

      // --- Extracted transformations ---

      setDonationByCategory(
        Object.entries(ov.donations.byCategory)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
      );


      setReportByStatus(
        ov.reports.byStatus.map((s, index) => ({
          id: index,
          label: s._id,
          value: s.count,
          color: STATS_COLORS[index % STATS_COLORS.length],
        }))
      );

      setUsersByRole(
        ov.usersByRole.map((r, index) => ({
          id: index,
          label: r._id,
          value: r.count,
          color: STATS_COLORS[index % STATS_COLORS.length],
        }))
      );

      setTrendData(
        tr.trend.map((t) => ({
          date: `${t._id.day}/${t._id.month}`,
          count: t.count,
        }))
      );

      setLoading(false);
    };

    fetch();
  }, [open, dateRange.fromDate, dateRange.toDate]);

  return {
    overview,
    trend,
    donationByCategory,
    reportByStatus,
    usersByRole,
    trendData,
    loading,
    error,
  };
};
