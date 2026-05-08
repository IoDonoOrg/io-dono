import api from "./api";

export const getAssociationReport = async ({ fromDate, toDate } = {}) => {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const [weeklyRes, itemsRes] = await Promise.all([
      api.get("/associations/weekly"),
      api.get(`/associations/items?${params.toString()}`),
    ]);

    console.log("Report settimanale:", weeklyRes.data);
    console.log("Report beni:", itemsRes.data);

    return {
      success: true,
      weeklyReport: weeklyRes.data,
      itemsReport: itemsRes.data,
    };
  } catch (e) {
    if (e.response) {
      console.error("Errore backend:", e.response.data.message);
      return { success: false, message: e.response.data.message };
    }
    return { success: false, message: "Errore server backend" };
  }
};
