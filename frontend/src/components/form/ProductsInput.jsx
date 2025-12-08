import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Paper,
  Typography,
  Stack,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductsInput({ value = [], onChange, error }) {
  const addEntry = () => {
    onChange([
      ...value,
      { id: Date.now(), product: "", quantity: "1", units: "kg" },
    ]);
  };

  const removeEntry = (id) => {
    if (value.length > 1) {
      onChange(value.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id, field, newValue) => {
    onChange(
      value.map((entry) =>
        entry.id === id ? { ...entry, [field]: newValue } : entry
      )
    );
  };

  // const getFormattedOutput = () => {
  //   return value
  //     .filter((e) => e.quantity && e.product)
  //     .map((e) => `${e.quantity} ${e.product}`)
  //     .join(", ");
  // };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Paper variant="outlined" className="p-2">
        <Stack spacing={2} className="mt-2">
          <Typography variant="h6">Prodotto</Typography>
          {value.map((entry) => (
            <Box
              key={entry.id}
              sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
            >
              <TextField
                label="Nome *"
                placeholder="Pane"
                value={entry.product}
                onChange={(e) =>
                  updateEntry(entry.id, "product", e.target.value)
                }
                size="small"
                sx={{ flex: 5 }}
                error={!!error}
              />
              <TextField
                label="Quantità *"
                placeholder="5"
                value={entry.quantity}
                onChange={(e) =>
                  updateEntry(entry.id, "quantity", e.target.value)
                }
                size="small"
                sx={{ flex: 1.5 }}
                error={!!error}
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    min: 1,
                    max: 100,
                    step: "0.5",
                  },
                }}
              />
              <TextField
                select
                label="Unità *"
                value={entry.units}
                onChange={(e) => updateEntry(entry.id, "units", e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              >
                <MenuItem value="kg">Kg</MenuItem>
                <MenuItem value="pz">Pz</MenuItem>
              </TextField>
              {value.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Rimuovi"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            {error}
          </Typography>
        )}
        <Button
          startIcon={<AddIcon />}
          onClick={addEntry}
          variant="text"
          sx={{ mt: 2 }}
        >
          Aggiungi Prodotto
        </Button>
      </Paper>
    </Box>
  );
}
