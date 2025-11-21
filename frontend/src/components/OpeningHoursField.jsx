import { TimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Box } from "@mui/material";
import { useState } from "react";

dayjs.extend(customParseFormat);

function OpeningHoursField({ children }) {
  const [startTime, setStartTime] = useState(dayjs("09:00", "HH:mm"));
  const [endTime, setEndTime] = useState(dayjs("18:00", "HH:mm"));

  const [startError, setStartError] = useState(null);
  const [endError, setEndError] = useState(null);

  const getErrorMessage = (error) => {
    if (error === "maxTime") return "Deve essere prima dell'orario di chiusura";
    if (error === "minTime") return "Deve essere dopo l'orario di apertura";
    return "";
  };

  return (
    <>
      <div>
        <h1 className="text-gray-500">{children}</h1>
      </div>
      <Box className="flex flex-row gap-2 justify-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeField
            fullWidth
            label="Dalle"
            defaultValue={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            maxTime={endTime}
            format="HH:mm"
            onError={(newError) => setStartError(newError)}
            slotProps={{
              textField: {
                helperText: getErrorMessage(startError),
                error: !!startError,
              },
            }}
          />
          <TimeField
            fullWidth
            label="Alle"
            defaultValue={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            minTime={startTime}
            format="HH:mm"
            onError={(newError) => setEndError(newError)}
            slotProps={{
              textField: {
                helperText: getErrorMessage(endError),
                error: !!endError,
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </>
  );
}

export default OpeningHoursField;
