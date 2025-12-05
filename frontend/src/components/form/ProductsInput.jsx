import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductsInput({ value = [], onChange, error }) {
  const addEntry = () => {
    onChange([...value, { id: Date.now(), quantity: "", product: "" }]);
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
                label="Nome"
                placeholder="es. Pane"
                value={entry.product}
                onChange={(e) =>
                  updateEntry(entry.id, "product", e.target.value)
                }
                size="small"
                sx={{ flex: 2 }}
                error={!!error}
              />
              <TextField
                label="Quantità"
                placeholder="es. 5kg"
                value={entry.quantity}
                onChange={(e) =>
                  updateEntry(entry.id, "quantity", e.target.value)
                }
                size="small"
                sx={{ flex: 1 }}
                error={!!error}
                type="number"
              />
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
        <Button
          startIcon={<AddIcon />}
          onClick={addEntry}
          variant="text"
          sx={{ mt: 2 }}
        >
          Aggiungi Prodotto
        </Button>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
