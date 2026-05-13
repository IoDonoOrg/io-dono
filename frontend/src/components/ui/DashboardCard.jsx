import { Paper, Typography } from "@mui/material";

function DashboardCard({ title, children, minHeight = 300, sx = {} }) {
  return (
    <Paper
      variant="elevation"
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "grey.40",
        minHeight: minHeight,
        ...sx,
      }}
    >
      {title && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  );
}

export default DashboardCard;
