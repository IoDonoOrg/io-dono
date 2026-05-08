import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "dayjs/locale/it";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Il componente aspetta che fromDate e toDate siano delle stringhe nel formato ISO
// Fa la conversione a oggetti dayjs
// Suppone anche che il parent aspetta le date in formato ISO, quindi quando chiama onChange converte di nuovo a stringa
function DateRangeField({ fromDate, toDate, onChange }) {
  const from = fromDate ? dayjs(fromDate) : null;
  const to = toDate ? dayjs(toDate) : null;

  // quando la data viene cambiata, chiama onChange con un oggetto che contiene le nuove date in formato ISO
  const handleFromChange = (date) => {
    if (!date) return;
    onChange({ fromDate: date.startOf("day").toISOString(), toDate });
  };

  // quando la data viene cambiata, chiama onChange con un oggetto che contiene le nuove date in formato ISO
  const handleToChange = (date) => {
    if (!date) return;
    onChange({ fromDate, toDate: date.endOf("day").toISOString() });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
        <DatePicker
          label="Da"
          value={from}
          onChange={handleFromChange}
          disableFuture
          format="DD/MM/YYYY"
          maxDate={to}
          slotProps={{ textField: { size: "small" } }}
        />
        <Typography variant="body2" color="text.secondary">
          –
        </Typography>
        <DatePicker
          label="A"
          value={to}
          onChange={handleToChange}
          disableFuture
          format="DD/MM/YYYY"
          minDate={from}
          slotProps={{ textField: { size: "small" } }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default DateRangeField;
