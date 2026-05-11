import api from "./api";

export const createReport = async (reportType, description, donationId, reportedUserId) => {
  try {
    const result = await api.post("/reports", {
      type: reportType,
      description,
      reportedUserId: reportedUserId || undefined,
      donationId: donationId || undefined,
    });
    return {
      success: true,
      message: "Segnalazione creata con successo",
      report: result.data.data.report,
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

// GET /reports
// Recupera le segnalazioni visibili all'utente corrente
// Supporta filtri opzionali: status, type, scope, fromDate, toDate, reporterId, reportedUserId, page, limit
export const getReports = async (params = {}) => {
  try {
    const result = await api.get('/reports', { params });
    return {
      success: true,
      message: "Segnalazioni recuperate con successo",
      reports: result.data.data.reports,
      meta: result.data.meta
    };
  } catch (e) {
    if (e.response) {
      console.log("Errore backend: ", e.response.data.message);
      return {
        success: false,
        message: e.response.data.message
      };
    }
    return {
      success: false,
      message: "Errore server backend"
    };
  }
};
