import { useState, useEffect } from "react";
import { STATS_COLORS } from "src/utils/statsUtility";
import { getDonationsTrend, getOverview } from "src/services/adminService";

export const useAdminStats = (open, dateRange = { fromDate: null, toDate: null }) => {
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

      // fetcha contemporaneamente sia l'overview che il trend delle donazioni
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

      // processa i dati ricevuti e aggiorna lo stato
      const ov = overviewRes.overview;
      const tr = trendRes.trend;

      setOverview(ov);
      setTrend(tr);

      // mappa i dati per le categorie di donazione in un formato adatto al grafico
      // ordina le categorie per valore decrescente
      setDonationByCategory(
        Object.entries(ov.donations.byCategory)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
      );


      // mappa i dati per lo stato delle segnalazioni in un formato adatto al grafico
      // assegna un colore da STATS_COLORS in modo ciclico
      setReportByStatus(
        ov.reports.byStatus.map((s, index) => ({
          id: index,
          label: s._id,
          value: s.count,
          color: STATS_COLORS[index % STATS_COLORS.length],
        }))
      );

      // mappa i dati per il ruolo degli utenti in un formato adatto al grafico
      // assegna un colore da STATS_COLORS in modo ciclico
      setUsersByRole(
        ov.usersByRole.map((r, index) => ({
          id: index,
          label: r._id,
          value: r.count,
          color: STATS_COLORS[index % STATS_COLORS.length],
        }))
      );

      // mappa i dati per il trend delle donazioni in un formato adatto al grafico
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
