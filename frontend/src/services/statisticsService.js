import api from "./api";

// funzione per ottenere il report delle associazioni, che include sia il report settimanale che il report dei beni
// restituisce un oggetto con campi:
// - success: booleano che indica se la richiesta è andata a buon fine
// - weeklyReport: dati del report settimanale (se success è true)
// - itemsReport: dati del report dei beni (se success è true)
// - message: messaggio di errore (se success è false)
export const getAssociationReport = async ({ fromDate, toDate } = {}) => {
  try {
    const params = `fromDate=${fromDate}&toDate=${toDate}`;

    // esegue entrambe le richieste in parallelo
    const [weeklyRes, itemsRes] = await Promise.all([
      api.get("/associations/reports/weekly"),
      api.get(`/associations/reports/items?${params}`),
    ]);

    // console.log("Report settimanale:", weeklyRes.data);
    // console.log("Report beni:", itemsRes.data);

    // restituisce entrambe le risposte in un unico oggetto
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
