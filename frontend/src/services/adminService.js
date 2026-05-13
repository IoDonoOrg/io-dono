import api from "./api";

// PATCH /users/:id/admin-state
// Ban/unban utente (solo ADMIN)
// isBanned: true per bannare, false per unban
export const banUser = async (id, isBanned, bannedReason = null) => {
  try {
    const result = await api.patch(`/admin/users/${id}`, {
      isBanned,
      ...(isBanned && bannedReason && { bannedReason }),
    });
    return {
      success: true,
      message: isBanned ? "Utente bannato con successo" : "Utente sbannato con successo",
      user: result.data.user,
    };
  } catch (e) {
    if (e.response) {
      console.log("Errore backend: ", e.response.data.message);
      return {
        success: false,
        message: e.response.data.message,
      };
    }
    return {
      success: false,
      message: "Errore server backend",
    };
  }
};


// Ottiene la panoramica delle statistiche KPI per la dashboard admin.
// Restituisce un oggetto con campi:
// - success: booleano che indica se la richiesta è andata a buon fine
// - overview: dati overview (period, donations, reports, usersByRole) (se success è true)
// - message: messaggio di errore (se success è false)
export const getOverview = async () => {
  try {
    const res = await api.get("admin/statistics/overview");
    return {
      success: true,
      overview: res.data,
    };
  } catch (e) {
    if (e.response) {
      console.error("Errore backend:", e.response.data.message);
      return { success: false, message: e.response.data.message };
    }
    return { success: false, message: "Errore server backend" };
  }
};

// Ottiene il trend delle donazioni nel tempo.
// Accetta un oggetto opzionale { fromDate, toDate } per filtrare il periodo.
// Restituisce un oggetto con campi:
// - success: booleano che indica se la richiesta è andata a buon fine
// - trend: dati del trend (period, trend) (se success è true)
// - message: messaggio di errore (se success è false)
export const getDonationsTrend = async ({ fromDate, toDate } = {}) => {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get(`admin/statistics/trend${query}`);
    return {
      success: true,
      trend: res.data,
    };
  } catch (e) {
    if (e.response) {
      console.error("Errore backend:", e.response.data.message);
      return { success: false, message: e.response.data.message };
    }
    return { success: false, message: "Errore server backend" };
  }
};

// TODO: implementare questa
// Ottiene le statistiche filtrate per area, tipo di bene, periodo e/o associazione.
// Accetta un oggetto opzionale { area, itemType, fromDate, toDate, associationId }.
// Restituisce un oggetto con campi:
// - success: booleano che indica se la richiesta è andata a buon fine
// - statistics: dati statistiche (period, filtersApplied, totals, associationWeeklyReport) (se success è true)
// - message: messaggio di errore (se success è false)
export const getAssociationStats = async (
  { area, itemType, fromDate, toDate, associationId } = {}
) => {
  try {
    const params = new URLSearchParams();
    if (area) params.append("area", area);
    if (itemType) params.append("itemType", itemType);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (associationId) params.append("associationId", associationId);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get(`admin/statistics${query}`);
    return {
      success: true,
      statistics: res.data,
    };
  } catch (e) {
    if (e.response) {
      console.error("Errore backend:", e.response.data.message);
      return { success: false, message: e.response.data.message };
    }
    return { success: false, message: "Errore server backend" };
  }
};
