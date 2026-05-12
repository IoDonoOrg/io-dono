// ReportView.jsx
import { Grid, Typography, Box } from "@mui/material";
import { formatDate, formatReportStatus } from "src/utils/format";

const REPORT_TYPE_LABELS = {
  MALFUNCTION: "Malfunzionamento",
  USER_BEHAVIOR: "Problema donazione",
};

function ReportView({ report }) {
  if (!report) {
    return (
      <Typography color="text.secondary">
        Nessuna segnalazione selezionata
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Stato
        </Typography>
        <Typography variant="body1">
          {formatReportStatus(report.status)}
        </Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Tipo
        </Typography>
        <Typography variant="body1">
          {REPORT_TYPE_LABELS[report.type] ?? report.type}
        </Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          ID Segnalazione
        </Typography>
        <Typography variant="body1">{report._id}</Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Data creazione
        </Typography>
        <Typography variant="body1">{formatDate(report.createdAt)}</Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Creata da
        </Typography>
        <Typography variant="body1">
          {report.reporterId?.name ?? "—"}
        </Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Utente segnalato
        </Typography>
        <Typography variant="body1">
          {report.reportedUserId?.name ?? "—"}
        </Typography>
      </Grid>

      {report.donationId && (
        <Grid item size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Donazione collegata
          </Typography>
          <Typography variant="body1">{report.donationId._id}</Typography>
        </Grid>
      )}

      <Grid item size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Descrizione
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.50",
            p: 1.5,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="body1">
            {report.description || "Nessuna descrizione fornita"}
          </Typography>
        </Box>
      </Grid>

      {report.resolution && (
        <Grid item size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Risoluzione
          </Typography>
          <Box
            sx={{
              bgcolor: "grey.50",
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="body1">{report.resolution}</Typography>
          </Box>
        </Grid>
      )}

      {report.closedAt && (
        <Grid item size={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Chiusa il
          </Typography>
          <Typography variant="body1">{formatDate(report.closedAt)}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default ReportView;
