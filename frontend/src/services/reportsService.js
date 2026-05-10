import api from "./api";

export const createReport = async (reportType, description, reportedUserId, donationId) => {
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
