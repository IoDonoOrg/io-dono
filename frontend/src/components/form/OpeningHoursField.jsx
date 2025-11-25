import { TimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Box, Typography } from "@mui/material";

dayjs.extend(customParseFormat);

function OpeningHoursField({ value, errors, fieldName, onChange }) {
  // funzione helper che converta una stringa in un oggetto dayjs
  const toDayjs = (timeStr) => {
    return timeStr ? dayjs(timeStr, "HH:mm") : null;
  };

  // una funzione helper che converta un oggetto dayjs in una stringa
  // (server per il componente parent)
  const handleTimeChange = (key, dayjsValue) => {
    // controlla se l'oggetto esiste e se è valide
    // se si --> lo converta in una stringa
    // altrimenti --> restituisce una stringa vuota
    const timeStr =
      dayjsValue && dayjsValue.isValid() ? dayjsValue.format("HH:mm") : "";

    // passa i data al parent
    onChange({
      ...value,
      [key]: timeStr,
    });
  };

  const startDayjs = toDayjs(value.start);
  const endDayjs = toDayjs(value.end);

  return (
    <>
      <Typography variant="body1" color="textSecondary">
        {fieldName}
      </Typography>
      <Box className="flex flex-row gap-2 justify-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeField
            fullWidth
            label="Dalle"
            value={startDayjs}
            onChange={(newValue) => handleTimeChange("start", newValue)}
            format="HH:mm"
            size="small"
            slotProps={{
              textField: {
                helperText: errors.start,
                error: !!errors.start,
              },
            }}
          />
          <TimeField
            fullWidth
            label="Alle"
            value={endDayjs}
            onChange={(newValue) => handleTimeChange("end", newValue)}
            format="HH:mm"
            size="small"
            slotProps={{
              textField: {
                helperText: errors.end,
                error: !!errors.end,
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </>
  );
}

export default OpeningHoursField;
