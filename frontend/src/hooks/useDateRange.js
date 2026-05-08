import { useState } from "react";
import dayjs from "dayjs";

// hook per gestire il range di date

// di default è l'ultima settimana, ma può essere modificato dall'utente tramite il DateRangePicker
const getDefaultRange = () => ({
  fromDate: dayjs().subtract(7, "day").startOf("day").toISOString(),
  toDate: dayjs().endOf("day").toISOString(),
});

// restituisce un oggetto con il range di date e una funzione per aggiornarlo
export const useDateRange = () => {
  const [dateRange, setDateRange] = useState(getDefaultRange);
  return { dateRange, setDateRange };
};
