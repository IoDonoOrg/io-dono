import { Paper, Typography } from "@mui/material";

export default function StatCard({ label, value, sub }) {
  return (
    <Paper
      variant="elevation"
      elevation={2}
      sx={{ p: 2, flex: 1, borderRadius: 2, bgcolor: "grey.40" }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.disabled">
          {sub}
        </Typography>
      )}
    </Paper>
  );
}
